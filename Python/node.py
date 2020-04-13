from enum import IntEnum

class Direction(IntEnum):
    NORTH = 1
    SOUTH = 2
    WEST  = 3
    EAST  = 4

# Successor : (Node, direction to node, distance)
class Node:
    def __init__(self, index=0):
        self.index = index
        # store successor as (Node, direction to node, distance)
        self.Successors = []

    def getIndex(self):
        return self.index

    def getSuccessors(self):
        return self.Successors

    def setSuccessor(self, successor, direction, length=1):
        self.Successors.append((successor, Direction(direction), int(length)))
        print("For Node {}, a successor {} is set.".format(self.index, self.Successors[-1]))
        return


    def getDirection(self, nd):
        """
        Return the direction of nd from the present node if nd is adjacent to the present node.
        For example, if nd is in the east of the present node, the function will return Direction.EAST = 4.
        If nd is not adjacent to the present node, print error message and return 0.
        :param nd:
        :return:
        """
        for succ in self.Successors:
            if succ[0] == nd:
                return succ[1]
        # For the valid input, the below part shouldn't be entered
        print("Error: node({}) is not the Successor of node({})".format(nd.getIndex(), self.index))
        return 0

    def isSuccessor(self, nd):
        for succ in self.Successors:
            if succ[0] == nd: 
                return True
        return False

