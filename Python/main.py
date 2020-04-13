from node import *
import maze as mz
import score
import interface
import time

import numpy as np
import pandas
import time
import sys
import os


def main():
    maze = mz.Maze("data/small_maze.csv")
    next_nd = maze.getStartPoint()
    node_dict = maze.getNodeDict()
    car_dir = Direction.SOUTH
    point = score.Scoreboard("data/UID.csv")
    interf = interface.interface()         # the part of calling interface.py was commented out.

    # Mode 0: for treasure-hunting with rule 1, which encourages you to hunt as many scores as possible.
    if (sys.argv[1] == '0'):
        print("Mode 0: for treasure-hunting with rule 1, which encourages you to hunt as many scores as possible")
        while (1):
            # ================================================
            # Basically, you will get a list of nodes and corresponding UID strings after the end of algorithm.
            # The function add_UID() would convert the UID string score and add it to the total score.
            # In the sample code, we call this function after getting the returned list.
            # You may place it to other places, just make sure that all the UID strings you get would be converted.
            # ================================================
            ndList = []
            deadend_node_num = 0
            for node in maze.nodes:
                if len(node.getSuccessors()) == 1:
                    deadend_node_num += 1
            start_nd = next_nd
            for i in range(1, deadend_node_num + 1):
                BFS_list = maze.strategy(start_nd)
                start_nd = BFS_list[-1]
                if i == deadend_node_num:
                    ndList = ndList + BFS_list
                else:
                    ndList = ndList + BFS_list[:-1]
                print("The route to deadend {}: {}".format(i, [j.getIndex() for j in BFS_list]))

            # Check the result for the whole BFS!
            print("The whole BFS route:", [node.getIndex() for node in ndList])

            # Modify the ndList to match the final contest's rule
            ndList = ndList[1:]

            count = 0
            for i in range(1, len(ndList)):
                current_node = ndList[i - 1]
                next_node = ndList[i]
                print("The coming node: Node", current_node.getIndex())
                print("The next going node: Node", next_node.getIndex())

                # current car position + current node + next node => action + new car direction
                print("Current car direction:", car_dir)
                action, car_dir = maze.getAction(car_dir, current_node, next_node)
                print("Updated car direction:", car_dir)

                # Wait until the BT says the car reaches a node
                while (1):
                    python_get_information = interf.ser.SerialReadString()
                    print(python_get_information is 'N')
                    if python_get_information is 'N':
                        count = count + 1
                        print("The car see a node!\n")
                        break
                
                # if the node is a leaf node and the node is not the starting node => read RFID 
                if len(current_node.getSuccessors()) == 1 and current_node.getIndex() != 1:
                    print("Reading RFID...")
                    interf.send_readRFID()
                    while (1):
                        # Will enter infinite loop if RFID doesn't read properly.

                        # state_cmd = input("Please enter a mode command: ")
                        # interf.ser.SerialWrite(state_cmd)
                        cnt = 0
                        cnt_limit = 300
                        (read_UID, waiting) = interf.ser.SerialReadByte()
                        print("Unused UID: {}, waiting: {}".format(read_UID, waiting))
                        (read_UID, waiting) = interf.ser.SerialReadByte()
                        while read_UID == "Not receive" and waiting == 0 and cnt < cnt_limit:
                            (read_UID, waiting) = interf.ser.SerialReadByte()
                            cnt += 1
                        print("Read count: {}".format(cnt))
                        print("UID: {}, waiting: {}".format(read_UID, waiting))
                        if cnt < cnt_limit:
                            while waiting < 4:
                                (read_UID_tmp, waiting_tmp) = interf.ser.SerialReadByte()
                                if waiting_tmp != 0:
                                    waiting = waiting + waiting_tmp
                                    read_UID = read_UID + read_UID_tmp
                                    print("UID: {}, waiting: {}".format(read_UID, waiting))
                            print("***** waiting: ", waiting)
                            if read_UID != "Not receive" and waiting == 4:
                                print("***** RFID ID: ", read_UID)
                                break
                        else:
                            break
                    print("-----End reading RFID.-----")

                # Tell BT to send the action back to Arduino
                print("Get action:", action)
                interf.send_action(action)
                # TODO: get UID under the node.
            print("Get action: ", mz.Action.HALT)
            interf.send_action(mz.Action.HALT)
            break

    # Mode 1: for treasure-hunting with rule 2, which requires you to hunt as many specified treasures as possible.
    elif (sys.argv[1] == '1'):
        print("Mode 1: for treasure-hunting with rule 2, which requires you to hunt as many specified treasures as possible.")
        while (1):
            nd = int(input("destination: "))
            if (nd == 0):
                print("end process")
                print('')
                break
            try:
                nd = node_dict[nd]
            except:
                print("Your input is not a valid node!")
                raise IndexError("No node!")
            ndList = maze.strategy_2(next_nd, nd)

            count = 0
            for i in range(1, len(ndList)):
                current_node = ndList[i - 1]
                next_node = ndList[i]

                # current car position + current node + next node => action + new car direction
                print("Current car direction:", car_dir)
                action, car_dir = maze.getAction(car_dir, current_node, next_node)
                print("Updated car direction:", car_dir)

                # Wait until the BT says the car reaches a node
                while (1):
                    python_get_information = interf.ser.SerialReadString()
                    print(python_get_information)
                    if python_get_information is 'N':
                        count = count + 1
                        print(python_get_information)
                        print("The car see a node!\n")
                        break

                # Tell BT to send the action back to Arduino
                print("Get action:", action)
                interf.send_action(action)
            print("Get action: ", mz.Action.HALT)
            interf.send_action(mz.Action.HALT)
            break

    # Mode 2: Self-testing mode.
    elif (sys.argv[1] == '2'):
        print("Mode 2: Self-testing mode.")
        # TODO: You can write your code to test specific function.
        while (1):
            state_cmd = input("Please enter a mode command: ")
            interf.ser.SerialWrite(state_cmd)
            # read_UID = interf.ser.SerialReadByte()
            # print(read_UID)

if __name__ == '__main__':
    main()
