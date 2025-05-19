package main

import (
	"reflect"
	"testing"
)

func Test_buildArrays(t *testing.T) {
	tests := []struct {
		name   string
		stacks [][]string
	}{
		{
			name: "testA",
			stacks: [][]string{
				{"bar", "foo", "main"},
				{"bar", "foo", "main"},
				{"baz1", "foo", "main"},
				{"baz1", "bar", "foo", "main"},
				{"baz2", "bar", "foo", "main"},
				{"baz2", "foo", "main"},
				{"why", "why", "what"},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			locationTable, stackParentArray, stackLocationIndex, stackIndex := buildArrays(tt.stacks)
			stacks := buildStacks(locationTable, stackParentArray, stackLocationIndex, stackIndex)
			if !reflect.DeepEqual(stacks, tt.stacks) {
				t.Errorf("buildArrays() %v, want %v", stacks, tt.stacks)
			}
		})
	}
}
