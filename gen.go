package main

import (
	"fmt"
	"strconv"
	"strings"
)

var (
	addingProps     = []string{"Adding", "Grouping"}
	cumulativeProps = []string{"Instantaneous", "Cumulative", "Delta"}
	monoProps       = []string{"Monotonic", ""}
	syncProps       = []string{"Synchronous", "Asynchronous"}
)

func main() {
	fmt.Println(`package main

import "fmt"


type (
	Kind int
)

const (
	// One of the following three MUST be set. There are 3 exclusive Temporality kinds.
	MASK_INSTANTANEOUS = 1 << 0
	MASK_CUMULATIVE    = 1 << 1
	MASK_DELTA         = 1 << 2

	// One of the following two MUST be set. There are 2 exclusive Structure kinds.
	MASK_GROUPING = 1 << 3
	MASK_ADDING   = 1 << 4

	// May be set with MASK_ADDING.
	MASK_MONOTONIC = 1 << 5

	// May be set for any instrument.
	MASK_SYNCHRONOUS = 1 << 6
)

var (
`)
	var fullnames []string
	var fullvalues []string

	for _, a := range addingProps {
		for _, m := range monoProps {
			if a == "Grouping" && m == "Monotonic" {
				continue
			}
			mfrag := ""
			mname := ""
			if m == "Monotonic" {
				mfrag = "|MASK_MONOTONIC"
				mname = "_MONOTONIC"
			}
			for _, c := range cumulativeProps {
				for _, s := range syncProps {
					sfrag := ""
					if s == "Synchronous" {
						sfrag = fmt.Sprint("|MASK_", strings.ToUpper(s))
					}
					fullname := fmt.Sprint(strings.ToUpper(a), mname, "_", strings.ToUpper(c), "_", strings.ToUpper(s))
					fullnames = append(fullnames, fullname)
					fullvalue := fmt.Sprint("MASK_", strings.ToUpper(a), "|MASK_", strings.ToUpper(c), mfrag, sfrag)
					fullvalues = append(fullvalues, fullvalue)
					fmt.Print(fullname, " Kind = ", fullvalue, "\n")
				}
			}
		}
	}
	fmt.Println(`)

func main() {
`)

	maxNameSize := 0

	for _, fn := range fullnames {
		if maxNameSize < len(fn) {
			maxNameSize = len(fn)
		}
	}

	for i, fn := range fullnames {
		fmt.Println(`fmt.Printf("  %-*s = %-*s; // %s\n", `, maxNameSize, ",", strconv.Quote(fn), ",", 4, ",", `fmt.Sprintf("%#x",`, fn, `)`, ",", strconv.Quote(fullvalues[i]), ")")
	}
	fmt.Println(`}`)
}
