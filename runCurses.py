import sys
import os
import serial
import time
from multiprocessing import Process
import curses

 
def printValidCommands(win):
    win.addstr(4,0,"The list of available commands is below:")
    win.addstr(5,0,"q: quit the application")
    win.addstr(6,0,"w: move the rover forward")
    win.addstr(7,0,"a: move the rover left")
    win.addstr(8,0,"s: move the rover back")
    win.addstr(9,0,"d: move the rover right")
    win.addstr(10,0,"Numbers 1 - 5: control the rover's speed where 1 is fastest and 5 is slowest")
    win.addstr(11,0,"Please do not hold down the key.")
#    win.addstr(9,0,"Please enter your command: ")
    win.refresh()

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

def loopCommand(screen):
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
        screen.addstr("Please enter your command: ")
        user_input = screen.getkey()
        screen.refresh()
        screen.addstr("You entered: " + user_input+"\n", curses.A_BOLD)
        if user_input == "q":
            screen.addstr("Exiting!")
            return 0
            break;
        elif user_input == "KEY_RESIZE":
            return 1
            break;
        elif user_input == "0":
            screen.addstr("STOP\n")
            if sendCom(0, 0):
                screen.addstr( "Rover successfully stopped.\n")
            else:
                screen.addstr("Stop Unsuccessful.\n" )
            speed = 0
        elif user_input == "w":
            screen.addstr("Moving the rover forward\n" )
            if sendCom(speed, speed):
                screen.addstr("Rover Forward.\n" )
            else:
                screen.addstr("Unsuccessful command execution\n" )
        elif user_input == "a":
            screen.addstr("Moving the rover left\n" )
            if sendCom(-speed, speed):
                screen.addstr("Rover Left.\n" )
            else:
                screen.addstr("Unsuccessful command execution.\n" )
        elif user_input == "s":
            screen.addstr("Moving the rover backward\n" )
            if sendCom(-speed, -speed):
                screen.addstr( "Rover Back.\n" )
            else:
                screen.addstr( "Unsuccessful command execution.\n")
        elif user_input == "d":
            screen.addstr( "Moving the rover right\n" )
            if sendCom(speed, -speed):
                screen.addstr( "Rover right." )
            else:
                screen.addstr( "Unsuccessful command execution.\n" )
        elif user_input == "1":
            screen.addstr("Speed set to 1\n" )
            speed = 1.5
        elif user_input == "2":
            screen.addstr( "Speed set to 2\n")
            speed = 2.5
        elif user_input == "3":
            screen.addstr( "Speed set to 3\n")
            speed = 3
        elif user_input == "4":
            screen.addstr( "Speed set to 4\n")
            speed = 4
        elif user_input == "5":
            screen.addstr( "Speed set to 5\n")
            speed = 5
        else:
            screen.addstr( "Please enter a valid command.\n")
        screen.refresh()

def watchdog(screen):
    '''
    print("First line", end="\n")
    sys.stdout.flush()
    print("Second line", end="\n")
    sys.stdout.flush()
    '''
    while(1):
        '''
        print("First line", end="\n")
        print("Second line", end="\n")
        '''
        comtime = time.time()
        while(1):
            if ser.inWaiting() > 0:
            #   print("arduino says:")
                time.sleep(.1)
                screen.addstr(str((ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()))
            #   print("arduino done")
                comtime = time.time()
                ser.write(b' ')
                time.sleep(1)

            elif comtime < time.time()-2:
                screen.addstr(colors.FAIL + "lost connection with arduino" + colors.END)
                break

            time.sleep(.1)
        sendCom(0,0)
        print("restarting Arduino Interface, stand by for connection")
        ser.close()
        ser.open()

def run(stdscr):
    #clear screen
    stdscr.clear()
    stdscr.scrollok(True)
    stdscr.idlok(1)
    #get screen max y and x values. dims[0] = y dims[1] = x
    dims = stdscr.getmaxyx()
    #create secondary screen
    win = curses.newwin(dims[0],int(dims[1]/2),0, int(dims[1]/2))
    win.clear()
    stdscr.resize(dims[0]-3, int(dims[1]/2))
    
    win.addstr(3,0,"Welcome to the amazing Rover project!\n")
    win.refresh()
    
    printValidCommands(win)

 #   filePath = os.path.dirname(os.path.abspath(__file__)) + "/"

#   ser = serial.Serial('/dev/ttyAMA0', baudrate = 9600)

    ser.flushInput()
    ser.flushOutput()

#    arduWatch = Process(target = watchdog, args = (stdscr))
#    arduWatch.start()

    loopCommand(stdscr)
    sendCom(0,0)

#    arduWatch.terminate()

    ser.close()
    
#Initiate Curses Wrapper, Init Library, cbreak, echoOff, keypadOn
print("begin")
time.sleep(1)
ser = serial.Serial('/dev/ttyAMA0', baudrate = 9600)
curses.wrapper(run)
