import socketio
import sys




class Socket(socketio.ClientNamespace):
    sio = socketio.Client()

    
    def __init__(self,ip):
        #***********************#
        # pass in the namespace '/'
        # https://python-socketio.readthedocs.io/en/latest/client.html#class-based-namespaces
        #***********************#
        super().__init__('/')
        self.sio.sleep(10)
        self.sio.connect(ip)
        self.sio.register_namespace(self)
    
    def on_connect(self):
        print("connected")
        self.emit("start_game")

    def on_game_end(self):
        print("game_end")

    def on_update_time(self,data):
        print(data)

    def on_game_started(self):
        print("start game")

    def on_game_already_started(self):
        print("game_already_started")


if __name__ == '__main__':
    mySocket = Socket('http://localhost:3000')

#sio.wait()
