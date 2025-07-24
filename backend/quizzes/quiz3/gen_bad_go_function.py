def gen(n):
    print("""package main

import "fmt"

func isEven(n int) bool {
	if n < 0 {
		panic("Non-negative numbers only!")
	} """, end="")
    
    for i in range(1, n+1):
        print(f"""else if n == {i} {{
            return {("true" if i % 2 == 0 else "false")}
        }}""", end=" ")
    
    print("""\n\n\tpanic("Your number is too big!")\n}""")    
    
    print(f"""
func main() {{
	fmt.Println(isEven({n}))
}}""")
    
if __name__ == "__main__":
    gen(20)
