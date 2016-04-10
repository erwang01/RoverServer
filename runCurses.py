import sys
#import os
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
    win.addstr(10,0,"speed: 0-> stop to 5 -> full speed")
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
            screen.addstr("Exiting!", curses.A_STANDOUT)
            return 0
            break;
        elif user_input == "KEY_RESIZE":
            return 1
            break
        elif user_input == "0":
            screen.addstr("STOP\n",curses.color_pair(1))
            if sendCom(0, 0):
                screen.addstr( "Rover successfully stopped.\n", curses.color_pair(2))
            else:
                screen.addstr("Stop Unsuccessful.\n", curses.color_pair(1))
            speed = 0
        elif user_input == "w":
            screen.addstr("Moving the rover forward\n", curses.color_pair(2))
            if sendCom(speed, speed):
                screen.addstr("Rover Forward.\n", curses.color_pair(2))
            else:
                screen.addstr("Unsuccessful command execution\n", curses.color_pair(1))
        elif user_input == "a":
            screen.addstr("Moving the rover left\n", curses.color_pair(2))
            if sendCom(-speed, speed):
                screen.addstr("Rover Left.\n", curses.color_pair(2))
            else:
                screen.addstr("Unsuccessful command execution.\n", curses.color_pair(1))
        elif user_input == "s":
            screen.addstr("Moving the rover backward\n", curses.color_pair(3))
            if sendCom(-speed, -speed):
                screen.addstr( "Rover Back.\n", curses.color_pair(2))
            else:
                screen.addstr( "Unsuccessful command execution.\n", curses.color_pair(1))
        elif user_input == "d":
            screen.addstr( "Moving the rover right\n", curses.color_pair(2))
            if sendCom(speed, -speed):
                screen.addstr( "Rover right.\n", curses.color_pair(2))
            else:
                screen.addstr( "Unsuccessful command execution.\n", curses.color_pair(1))
        elif user_input == "1":
            screen.addstr("Speed set to 1\n", curses.color_pair(3))
            speed = 1.5
        elif user_input == "2":
            screen.addstr( "Speed set to 2\n", curses.color_pair(3))
            speed = 2.5
        elif user_input == "3":
            screen.addstr( "Speed set to 3\n", curses.color_pair(3))
            speed = 3
        elif user_input == "4":
            screen.addstr( "Speed set to 4\n", curses.color_pair(3))
            speed = 4
        elif user_input == "5":
            screen.addstr( "Speed set to 5\n", curses.color_pair(3))
            speed = 5
        else:
            screen.addstr( "Please enter a valid command.\n", curses.color_pair(1))
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
        cursor = screen.getyx()
        while(1):
            screen.move(cursor[0],cursor[1])
            if ser.inWaiting() > 0:
            #   print("arduino says:")
                time.sleep(.1)
                screen.addstr(str((ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()+(ser.readline()).decode()))
            #   print("arduino done")
                comtime = time.time()
                ser.write(b' ')
                time.sleep(1)

            elif comtime < time.time()-2:
                screen.addstr("lost connection with arduino\n", curses.color_pair(1))
                break
            cursor = screen.getyx()
            screen.refresh()
            time.sleep(.1)
        sendCom(0,0)
        screen.addstr("restarting Arduino Interface, stand by for connection\n", curses.color_pair(3))
        ser.close()
        ser.open()

def run(stdscr):
    #get screen max y and x values. dims[0] = y dims[1] = x
    dims = stdscr.getmaxyx()
    #create instructions screen
    win = curses.newwin(dims[0],int(dims[1]/2),0, int(dims[1]/2))

    #create Arduino Watchdog screen
    log = curses.newwin(int(dims[0]/2),int(dims[1]/2),int(dims[0]/2), int(dims[1]/2))
    log.clear()
    log.scrollok(True)
    log.idlok(1)



    #resizing screens
    stdscr.resize(dims[0]-3, int(dims[1]/2)-3)
    win.resize(int(dims[0]/2)-3, int(dims[1]))
    log.resize(int(dims[0]/2)-3, int(dims[1]/2))

    #setup screens
    win.clear()
    win.scrollok(True)
    win.idlok(1)
    stdscr.clear()
    stdscr.scrollok(True)
    stdscr.idlok(1)

    win.addstr(3,0,"Welcome to the amazing Rover project!\n")
    win.refresh()

    curses.init_pair(1, curses.COLOR_RED, curses.COLOR_WHITE)
    curses.init_pair(2, curses.COLOR_GREEN, curses.COLOR_BLACK)
    curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK)    #warnings

    printValidCommands(win)

    ser.flushInput()
    ser.flushOutput()
    log.addstr("Welcome to the amazing Arduino Watchdog!\n")
    log.refresh()
    arduWatch = Process(target = watchdog, args=(stdscr,))
    arduWatch.start()
    while loopCommand(log):
        dims = stdscr.getmaxyx()
        stdscr.resize(dims[0]-3, int(dims[1]/2)-3)
        win.resize(int(dims[0]/2)-3, int(dims[1]/2))
        log.resize(int(dims[0]/2)-3, int(dims[1]/2))
        stdscr.clear()
        win.clear()
        log.clear()
        printValidCommands(win)
        loopCommand(log)
    sendCom(0,0)

    arduWatch.terminate()

    ser.close()

#Initiate Curses Wrapper, Init Library, cbreak, echoOff, keypadOn
print("begin")
time.sleep(1)
#ser = serial.Serial('/dev/ttyAMA0', baudrate = 9600)
ser = serial.Serial('/dev/cu.usbserial-AM01VDHP', baudrate = 9600) #for mac testing on robot

curses.wrapper(run)
