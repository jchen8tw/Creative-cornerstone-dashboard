import socketio
import requests
import sys


ip = "https://creative.ntuee.org"
def stop_game():
    g = requests.get(ip+"/game_status")
    cur_team = g.json()['current_team']
    if(cur_team != None):
        sio = socketio.Client()
        sio.connect(ip)
        sio.emit("stop_game")
        #sio.disconnect()

def reset_game():
    g = requests.get(ip+"/reset?pass=taonly")
    print(g.json())

if __name__ == '__main__':
    #stop_game()
    try:
        if(sys.argv[1] == 'stop'):
            stop_game()
        elif(sys.argv[1] == 'reset'):
            reset_game()
    except:
        print("Error")
        pass
