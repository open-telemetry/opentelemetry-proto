package main

import (
	"fmt"
	"strings"
)

func main() {
	// stacks contains the stack traces with leaf frame at position 0.
	// That's how we store them in ebpf-profiler (natural order).
	//
	// After encoding, we have
	//
	//	locationTable: [{} {main} {foo} {bar} {baz1} {baz2} {what} {why}]
	//	stackParentArray: [0 0 1 2 2 3 3 2 0 8 9]
	//	stackLocationIndex: [0 1 2 3 4 4 5 5 6 7 7]
	//	stackIndex: [3 3 4 5 6 7 10]
	var stacks = [][]string{
		{"bar", "foo", "main"},
		{"bar", "foo", "main"},
		{"baz1", "foo", "main"},
		{"baz1", "bar", "foo", "main"},
		{"baz2", "bar", "foo", "main"},
		{"baz2", "foo", "main"},
		{"why", "why", "what"},
	}

	// Build the arrays
	locationTable, stackParentArray, stackLocationIndex, stackIndex := buildArrays(stacks)

	// Print the arrays
	fmt.Println("locationTable:", locationTable)
	fmt.Println("stackParentArray:", stackParentArray)
	fmt.Println("stackLocationIndex:", stackLocationIndex)
	fmt.Println("stackIndex:", stackIndex)

	// Print the stacks, demonstrates how to construct the stacks from the arrays.
	for _, i := range stackIndex {
		for i != 0 {
			fmt.Printf(" %s", locationTable[stackLocationIndex[i]])
			i = stackParentArray[i]
		}
		fmt.Println()
	}
}

// Location is a fake type to represent a location.
type Location struct {
	name string
}

type stackData struct {
	parentStackID  string
	parentArrayIdx int
	locationIdx    int
}

func buildArrays(stacks [][]string) (locationTable []Location, stackParentArray []int, stackLocationIndex []int, stackIndex []int) {
	uniqueStacks := make(map[string]stackData)
	uniqueLocations := make(map[string]int)

	// Add an artificial root frame.
	locationTable = append(locationTable, Location{name: ""})
	uniqueLocations[""] = 0
	rootID := mkStackID([]string{""})
	uniqueStacks[rootID] = stackData{parentStackID: "", parentArrayIdx: 0, locationIdx: 0}

	for _, stack := range stacks {
		parentStackID := rootID
		for i := len(stack) - 1; i >= 0; i-- {
			stackID := mkStackID(stack[i:])
			index, ok := uniqueStacks[stackID]
			if !ok {
				index.parentArrayIdx = len(uniqueStacks)
				index.locationIdx, ok = uniqueLocations[stack[i]]
				if !ok {
					index.locationIdx = len(uniqueLocations)
					uniqueLocations[stack[i]] = index.locationIdx
				}
				index.parentStackID = parentStackID
				uniqueStacks[stackID] = index
			}
			parentStackID = stackID
		}
	}

	// Create the location table with a single allocation.
	locationTable = make([]Location, len(uniqueLocations))
	for name, idx := range uniqueLocations {
		locationTable[idx] = Location{name: name}
	}

	// Create the stack arrays, each with a single allocation.
	stackLocationIndex = make([]int, len(uniqueStacks))
	stackParentArray = make([]int, len(uniqueStacks))
	for _, v := range uniqueStacks {
		stackLocationIndex[v.parentArrayIdx] = v.locationIdx
		if v.locationIdx == 0 {
			stackParentArray[v.parentArrayIdx] = 0
		} else {
			parentStackTrace := uniqueStacks[v.parentStackID]
			stackParentArray[v.parentArrayIdx] = parentStackTrace.parentArrayIdx
		}
	}

	// Keep track of the leaf frames, allows reconstructing the input stacks.
	stackIndex = make([]int, len(stacks))
	for i, stack := range stacks {
		stackIndex[i] = uniqueStacks[mkStackID(stack)].parentArrayIdx
	}

	return
}

// mkStackID creates a unique ID for a stack trace.
func mkStackID(stack []string) string {
	var builder strings.Builder
	for i := 0; i < len(stack); i++ {
		builder.WriteString(stack[i])
		builder.WriteString("|")
	}
	return builder.String()
}

// buildStacks reconstructs the stacks from the arrays.
func buildStacks(locationTable []Location, stackParentArray []int, stackLocationIndex []int, stackIndex []int) [][]string {
	stacks := make([][]string, len(stackIndex))
	for stackIdx, i := range stackIndex {
		stack := make([]string, 0)
		for i != 0 {
			stack = append(stack, locationTable[stackLocationIndex[i]].name)
			i = stackParentArray[i]
		}
		stacks[stackIdx] = stack
	}
	return stacks
}
