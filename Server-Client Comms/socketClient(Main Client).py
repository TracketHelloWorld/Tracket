from socketIO_client import SocketIO, BaseNamespace

class ChatNamespace(BaseNamespace):

    def reply(self, *args):
        print('reply', args)

class NewsNamespace(BaseNamespace):

    def on_aaa_response(self, *args):
        print('on_aaa_response', args)



def reply(*args):
    print('reply', args)

socketIO = SocketIO('andrewarpasi.com', 6969)

socketIO.emit('registerListener', {'UID': 'testID'}, reply)
socketIO.on("feedback", reply)
socketIO.wait_for_callbacks(seconds=1)
