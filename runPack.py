import sys#, tty
import os
import serial
import time
from multiprocessing import Process

 
def printValidCommands():
    print("The list of available commands is below:")
    print("q: quit the application")
    print("w: move the rover forward")
    print("a: move the rover left")
    print("s: move the rover back")
    print("d: move the rover right")
    print("Numbers 1 - 5: control the rover's speed where 1 is fastest and 5 is slowest")
    print("Please do not hold down the key.")
    print("Please enter your command: ")

def sendCom(valueL, valueR):
    resultLeft = valueL*80;
    resultRight = valueR*80;
    if valueL == 0:
        resultLeft = 0;
    if valueR == 0:
        resultRight = 0;
    if ser.write((str(resultLeft) + ", " + str(resultRight) + "\n").encode()):

        return True
    else:
        return False

class colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def loopCommand():
    speed = 0.0
    while(True):
        '''
        User commands:
        q = quit
        w = forward
        a = left
        s = back
        d = right
        0 - 5: speed where 5 is highest, 0 is stop
        '''
        user_input = input().strip() 
        print(colors.HEADER + "You entered: " + user_input + colors.END)
        if user_input == "q":
            print("Exiting!")
            break;
        elif user_input == "0":
            print(colors.BLUE + "STOP" + colors.END)
            if sendCom(0, 0):
                print(colors.GREEN + "Rover successfully stopped." + colors.END)
            else:
                print(colors.FAIL + "Stop Unsuccessful." + colors.END)
            speed = 0
        elif user_input == "w":
            print(colors.GREEN + "Moving the rover forward" + colors.END)
            if sendCom(speed, speed):
                print(colors.GREEN + "Rover Forward." + colors.END)
            else:
                print(colors.FAIL + "Unsuccessful command execution" + colors.END)
        elif user_input == "a":
            print(colors.GREEN + "Moving the rover left" + colors.END)
            if sendCom(speed, -speed):
                print(colors.GREEN + "Rover Left." + colors.END)
            else:
                print(colors.FAIL + "Unsuccessful command execution." + colors.END)
        elif user_input == "s":
            print(colors.GREEN + "Moving the rover backward" + colors.END)
            if sendCom(-speed, -speed):
                print(colors.GREEN + "Rover Back." + colors.END)
            else:
                print(colors.FAIL + "Unsuccessful command execution." + colors.END)
        elif user_input == "d":
            print(colors.GREEN + "Moving the rover right" + colors.END)
            if sendCom(-speed, speed):
                print(colors.GREEN + "Rover right." + colors.END)
            else:
                print(colors.FAIL + "Unsuccessful command execution." + colors.END)
        elif user_input == "1":
            print(colors.BLUE + "Speed set to 1" + colors.END)
            speed = 1.5
        elif user_input == "2":
            print(colors.BLUE + "Speed set to 2" + colors.END)
            speed = 2.5
        elif user_input == "3":
            print(colors.BLUE + "Speed set to 3" + colors.END)
            speed = 3
        elif user_input == "4":
            print(colors.BLUE + "Speed set to 4" + colors.END)
            speed = 4
        elif user_input == "5":
            print(colors.BLUE + "Speed set to 5" + colors.END)
            speed = 5
        else:
            print(colors.WARNING + "Please enter a valid command." + colors.END)
            printValidCommands()

def watchdog():
    print("First line", end="\n")
    sys.stdout.flush()
    print("Second line", end="\n")
    sys.stdout.flush()
    while(1):
        print("First line", end="\n")
        print("Second line", end="\n")
        comtime = time.time()
        while(1):
            if ser.inWaiting() > 0:
                print("arduino says:")
                time.sleep(.1)
                print(str((ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()))
                print("arduino done")
                comtime = time.time()
                ser.write(b' ')
                time.sleep(1)

            elif comtime < time.time()-2:
                print(colors.FAIL + "lost connection with arduino" + colors.END)
                break;

            time.sleep(.1)
        sendCom(0,0)
        print("restarting Arduino Interface, stand by for connection")
        ser.close()
        ser.open()


print("Welcome to the amazing Rover project!")
printValidCommands()

filePath = os.path.dirname(os.path.abspath(__file__)) + "/"

ser = serial.Serial('/dev/ttyAMA0', baudrate = 9600)

ser.flushInput()
ser.flushOutput()

watchdog = Process(target = watchdog)
watchdog.start()

loopCommand()
sendCom(0,0)

watchdog.terminate()

ser.close()
