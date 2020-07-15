// Copyright 2019, OpenTelemetry Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Notes: This code generates the Kind enum in metrics.proto.  To run this
// code, execute:
//
//   go run gen.go > out.go && go run out.go
//
// The output of this program MUST be tested in an external module,
// using the output of protoc.

package main

import (
	"fmt"
	"strconv"
	"strings"
)

var (
	cumulativeProps = []string{"Instantaneous", "Delta", "Cumulative"}
	addingProps     = []string{"Adding", "Grouping"}
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
	INSTANTANEOUS = 1 << 0
	DELTA         = 1 << 1
	CUMULATIVE    = 1 << 2

	// One of the following two MUST be set. There are 2 exclusive Structure kinds.
	ADDING   = 1 << 3
	GROUPING = 1 << 4

	// May be set with ADDING.
	MONOTONIC = 1 << 5

	// May be set for any instrument.
	ASYNCHRONOUS = 1 << 6
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
				mfrag = "|MONOTONIC"
				mname = "_MONOTONIC"
			}
			for _, c := range cumulativeProps {
				for _, s := range syncProps {
					if c == "Instantaneous" && s == "Asynchronous" {
						continue
					}
					sfrag := ""
					sname := ""
					if s == "Asynchronous" {
						sfrag = "|ASYNCHRONOUS"
						sname = "_ASYNCHRONOUS"
					}
					fullname := fmt.Sprint(strings.ToUpper(a), mname, "_", strings.ToUpper(c), sname)
					fullnames = append(fullnames, fullname)
					fullvalue := fmt.Sprint("", strings.ToUpper(a), "|", strings.ToUpper(c), mfrag, sfrag)
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
		fmt.Println(`fmt.Printf("  %s = %s; // %s\n", `, strconv.Quote(fn), ",", `fmt.Sprintf("%#x",`, fn, `)`, ",", strconv.Quote(fullvalues[i]), ")")
	}
	fmt.Println(`}`)
}
