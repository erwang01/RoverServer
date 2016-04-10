#ser = serial.Serial('/dev/ttyAMA0', baudrate = 9600)   #for raspberry pi
#ser = serial.Serial('/dev/tty.Bluetooth-Incoming-Port', baudrate = 9600)    #for mac empty testing
ser = serial.Serial('/dev/cu.usbserial-AM01VDHP', baudrate = 9600) #for mac testing on robot
time.sleep(1)
while (ser.inWaiting()>0):
    command = str((ser.readline()).decode('utf-8','strict')))
    updateData(command)


def updateData(command):
    if command.index("Status:"):
        setStatus(command["Status:".length+1: command.length])

    else if command.index("M1 current:"):
        setM1(command["M1 current:".length+1: command.length])

    else if command.index("M2 current:")
        setM2(command["M2 current:".length+1: command.length])

    else if command.index("Deg C:")
        setTemp(command["Deg C:".length+1: command.length])

    else:
        setUnknown(command)

def setStatus(message):
    print(message)

def setM1(message):
    print(message)

def setM2(message):
    print(message)

def setTemp(message):
    print(message)

def setUnknown(message):
    print(message)
