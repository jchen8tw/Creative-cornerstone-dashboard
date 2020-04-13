import socketio

sio = socketio.Client()

@sio.event
def connect():
    print("connected")
    sio.emit("start_game")

@sio.event
def game_end():
    print("game_end")

@sio.event
def update_time(data):
    print(data)

@sio.event
def game_started():
    print("start game")

@sio.event
def game_already_started():
    print("game_already_started")


sio.connect('http://localhost:3000')
sio.wait()
