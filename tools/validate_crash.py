#--allow-natives-syntax --debug-code --single-threaded --predictable --interrupt-budget=1024 --no-arguments --detailed-error-trace --gc-interval=1 --stress-compaction


import os
import sys
from subprocess import PIPE, Popen
import shutil


'''
    "--expose-gc",
    "--predictable",
    "--allow-natives-syntax",
    "--interrupt-budget=1024",
    "--no-arguments",
'''
if len(sys.argv)==3:
    v8_path = sys.argv[1]
    target_path = sys.argv[2]
else:
    exit(2)

class shell_result:
    def __init__(self,path, stdout,stderr, return_code):
        self.stdout = stdout
        self.stderr = stderr
        self.path = path
        self.returncode = return_code
    def result_print():
        print ('//-----------------------\\\\')
        print('===========stdout===========')
        print(self.stdout)
        print('===========stderr===========')
        print ('\\\\-----------------------//')
        print(self.stderr)

def execute_file(shell_path, file_path):
    print(file_path)
    cmd = '''{}  --allow-natives-syntax --predictable --expose-gc --no-arguments --interrupt-budget=1024 {}
    '''.format(shell_path, file_path)
    p = Popen(cmd, shell=True, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    result = shell_result(file_path,stdout,stderr,p.returncode)
    print(p.returncode)
    print(result.path)
    print(result.stderr)
    return result

def is_valid(result):
    stdout_filter = [
        'stack_guard->real_jslimit()',
        'call stack size exceeded',
        '# Debug check failed: 0 <= index && index < node->op()->ValueInputCount().'
    ]
    stderr_filter = [
        'stack_guard->real_jslimit()',
        'Fatal javascript OOM',
        '# Debug check failed: 0 <= index && index < node->op()->ValueInputCount().'
    ]
    for filter in stdout_filter:
        if result.stdout.find(filter) != -1:
            return False
    for filter in stderr_filter:
        if result.stderr.find(filter) != -1:
            return False
    return True


def validate_crushes():
    sh_result = execute_file(v8_path, target_path)
    if is_valid(sh_result) == False or sh_result.returncode == 0 or sh_result.returncode == 1:
        exit(0)
    else:
        exit(1)

validate_crushes()









