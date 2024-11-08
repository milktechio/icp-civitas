import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import SB "libs/StableBuffer";

type Poll = {
        id : Nat;
        name : Text;
        var options : [Option];
        var votes : [var Nat];
};

type Option = {
    id: Nat;
    name: Text;
};

type SharedBuffer = {
      count : Nat;
      elems : [SharedPoll];
};

type SharedPoll = {
    id : Nat;
    name : Text;
    options : [Option];
    votes : [Nat];
    status : Text;
};

class PollOps(polls : SB.StableBuffer<Poll>){
    // Agrega opciones a la votación
    public func createPoll(pollName: Text, optionNames: [Text]) : SharedPoll {
        var _options : [Option] = [];
        for (i in optionNames.keys()){
            _options:= Array.append<Option>(_options, [{id = Array.size(_options);name = optionNames[i]}]);
        };
        let new_poll : Poll = {
            id = SB.size(polls); 
            name = pollName; 
            var options = _options;
            var votes = Array.init<Nat>(Array.size(optionNames), 0)
            };
        SB.add(polls, new_poll);
        return makePollShare(new_poll,"Ok");
    };

   public func addVoteFor(idPoll : Nat, idOption: Nat, amountVotes : Nat) : SharedPoll {
        let testPoll = SB.getOpt(polls, idPoll);
        switch (testPoll) {
            case (?poll) {
                let testOption = Array.find<Option>(poll.options,func (x) = x.id == idOption);
                switch(testOption){
                    case(?_){
                        poll.votes[idOption]+=amountVotes;
                        return makePollShare(poll,"Ok");
                    };
                    case(null){
                        return makePollShare(poll,"Error: Opcion no existe");
                    };
                };
            };
            case (null) {
                return {
                    id = 100000;
                    name = "--";
                    options = [];
                    votes = [];
                    status = "Error: Poll no existe";
                };
            }
        }
    };

    public func getAllPolls() : SharedBuffer {
        let buffSh = Buffer.Buffer<SharedPoll>(1);
        for(i in SB.vals(polls)){
            buffSh.add(makePollShare(i,"Ok"));
        };
        let sharedBuffer = {
            count = SB.size(polls);
            elems = Buffer.toArray(buffSh);
        };
        return sharedBuffer;
    };

    public func getPollById(id : Nat) : SharedPoll{
        return makePollShare(SB.get(polls,id),"Ok");
    };
 
    private func makePollShare(poll: Poll, status : Text) : SharedPoll{
        let sharedpoll : SharedPoll = {
            id = poll.id;
            name = poll.name;
            options = poll.options;
            votes = Array.freeze(poll.votes);
            status = status;
        };
        return sharedpoll;
    };
};