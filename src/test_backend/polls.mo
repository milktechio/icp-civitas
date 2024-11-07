import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Array "mo:base/Array";
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

class PollOps(polls : SB.StableBuffer<Poll>){
    // Agrega opciones a la votación
    public func createPoll(voteName: Text, optionNames: [Text]) : Bool {
        var _options : [Option] = [];
        for (i in optionNames.keys()){
            _options:= Array.append<Option>(_options, [{id = Array.size(_options);name = optionNames[i]}]);
        };
        let new_poll : Poll = {
            id = SB.size(polls); 
            name = voteName; 
            var options = _options;
            var votes = Array.init<Nat>(Array.size(optionNames), 0)
            };
        SB.add(polls, new_poll);
        return true;
    };

    //Añadir votos a una opcion especifica de una votacion
    public func addVoteFor(idPoll : Nat, idOption: Nat, amountVotes : Nat) : Bool {
        let testPoll = SB.getOpt(polls, idPoll);
        switch (testPoll) {
            case (?poll) {
                let testOption = Array.find<Option>(poll.options,func (x) = x.id == idOption);
                switch(testOption){
                    case(?_){
                        poll.votes[idOption]+=amountVotes;
                    };
                    case(null){
                        return false;
                    };
                };
                return true;
            };
            case (null) {
                return false;
            }
        }
    };


    //Devuelve todas las opciones de la votacion
    public func getAllPollsName() : [Text] {
    var names : [Text] = [];
    for(i in SB.vals(polls)){
        names := Array.append<Text>(names, [i.name]);
    };
    return names;
    }
};