import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import SB "libs/StableBuffer";

type Poll = {
        id : Nat;
        var name : Text;
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
            var name = pollName; 
            var options = _options;
            var votes = Array.init<Nat>(Array.size(optionNames), 0)
            };
        SB.add(polls, new_poll);
        return makePollShare(new_poll,"Ok");
    };

    public func removePoll(id : Nat) : SharedPoll{
        let poll = SB.getOpt(polls,id);
        switch(poll){
            case(?poll){
                return makePollShare( SB.remove(polls,id),"Ok");
            };
            case (null){
                return {
                    id = 100000;
                    name = "--";
                    options = [];
                    votes = [];
                    status = "Error: Poll no existe";
                }; 
            };
        };
    };

    public func renamePoll(id: Nat, new_Name : Text) : SharedPoll{
        let poll = SB.getOpt(polls,id);
        switch(poll){
            case(?poll){
                poll.name := new_Name;
                SB.put(polls,id,poll);
                return makePollShare(poll,"Ok");
            };
            case (null){
                return {
                    id = 100000;
                    name = "--";
                    options = [];
                    votes = [];
                    status = "Error: Poll no existe";
                }; 
            };
        };
    };

   public func addOptionToPoll(id: Nat,new_option : Text) : SharedPoll{
        let poll = SB.getOpt(polls,id);
        switch(poll){
            case(?poll){
                poll.options := Array.append<Option>(poll.options, [{id = Array.size(poll.options);name = new_option}]);
                let newArray = Array.init<Nat>(Array.size(poll.options), 0);
                var i = 0;
                while (i < poll.options.size()-1) {
                  newArray[i] := poll.votes[i];
                  i += 1;
                };
                newArray[poll.options.size()] := 0;
                SB.put(polls,id,poll);
                return makePollShare(poll,"Ok");
            };
            case (null){
                return {
                    id = 100000;
                    name = "--";
                    options = [];
                    votes = [];
                    status = "Error: Poll no existe";
                }; 
            };
        };
    }; 

    public func removeOptionToPoll(id: Nat, idOption : Nat) : SharedPoll{
        let poll = SB.getOpt(polls,id);
        switch(poll){
            case(?poll){
                poll.options := removeElement(poll.options,idOption);
                removeElementMut(poll.votes,idOption);
                SB.put(polls,id,poll);
                return makePollShare(poll,"Ok");
            };
            case (null){
                return {
                    id = 100000;
                    name = "--";
                    options = [];
                    votes = [];
                    status = "Error: Poll no existe";
                }; 
            };
        };
    };

   public func addVoteFor(idPoll : Nat, idOption: Nat, amountVotes : Nat) : SharedPoll {
        let testPoll = SB.getOpt(polls, idPoll);
        switch (testPoll) {
            case (?poll) {
                let testOption = Array.find<Option>(poll.options,func (x) = x.id == idOption);
                switch(testOption){
                    case(?_){
                        poll.votes[idOption]+=amountVotes;
                        SB.put(polls,idPoll,poll);
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
    private func removeElement<T>(arr: [T], index: Nat): [T] {
    Array.tabulate<T>(arr.size() - 1, func (i) {
        if (i < index) { arr[i] } else { arr[i + 1] }
    })
    };

    private func removeElementMut(arr: [var Nat], index: Nat) {
        if (index >= arr.size()) return;
        var i = index;
        while (i < arr.size() - 1) {
            arr[i] := arr[i + 1];
            i += 1;
        };
        arr[arr.size() - 1] := 0;
}
};