// Copyright 2020, OpenTelemetry Authors
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

// Notes: This code generates the Kind enum hex in metrics.proto.  To
// run this code, execute:
//
//   go run gen.go > out.go && go run out.go
//
// The output of this program MUST be tested in an external module,
// using the output of protoc.

package main

import (
	"bytes"
	"fmt"
	"go/format"
	"os"
	"strconv"
	"strings"
)

var (
	cumulativeProps = []string{"Instantaneous", "Delta", "Cumulative"}
	structureProps  = []string{"Adding_Monotonic", "Adding", "Grouping"}
	syncProps       = []string{"Continuous", "Snapshot"}
)

func main() {
	var buf bytes.Buffer
	buf.WriteString(`package main

import "fmt"


type (
	Kind int
)

const (
        INVALID = 0

	// One of the following three MUST be set. There are 3 exclusive Temporality kinds.
	INSTANTANEOUS = 1 << 0
	DELTA         = 2 << 0
	CUMULATIVE    = 3 << 0

	// One of the following three MUST be set. There are 3 exclusive Structure kinds.
	GROUPING         = 1 << 2
	ADDING           = 2 << 2
	ADDING_MONOTONIC = 3 << 2

	// May be set for any instrument.
	SNAPSHOT = 1 << 4
)

var (
`)
	var fullnames []string
	var fullvalues []string

	for _, c := range cumulativeProps {
		for _, a := range structureProps {
			for _, s := range syncProps {
				sfrag := ""
				if s == "Snapshot" {
					sfrag = fmt.Sprint("|", strings.ToUpper(s))
				}
				fullname := fmt.Sprint(strings.ToUpper(c), "_", strings.ToUpper(a), "_", strings.ToUpper(s))
				fullnames = append(fullnames, fullname)
				fullvalue := fmt.Sprint(strings.ToUpper(c), "|", strings.ToUpper(a), sfrag)
				fullvalues = append(fullvalues, fullvalue)
				buf.WriteString(fmt.Sprint(fullname, " Kind = ", fullvalue, "\n"))
			}
		}
	}
	buf.WriteString(`)

func main() {
`)

	for i, fn := range fullnames {
		buf.WriteString(fmt.Sprint(`fmt.Printf("  %s = %s; // %s\n", `, strconv.Quote(fn), ",", `fmt.Sprintf("%#x",`, fn, `)`, ",", strconv.Quote(fullvalues[i]), ")\n"))
	}
	buf.WriteRune('}')

	src, err := format.Source(buf.Bytes())
	if err != nil {
		fmt.Println("SOURCE WAS\n", string(buf.Bytes()))
		panic(err)
	}
	if nwritten, err := os.Stdout.Write(src); err != nil || nwritten != len(src) {
		panic(err)
	}
}