import Nat "mo:base/Nat";
import Option "mo:base/Option";
import SB "libs/StableBuffer";

type Option = {
        id : Nat;
        name : Text;
        var votes : Nat;
};

class Poll(polls : SB.StableBuffer<Option>){
    // Agrega opciones a la votación
    public func addOptions(voteName: Text, optionNames: [Text]) : Bool {
        var added = false;
        for (name in optionNames.vals()) {
            let new_option : Option = { id = SB.size(polls); name = name; var votes = 0 };
            SB.add(polls, new_option);
            added := true;
        };
        return added;
    };

    public func addVoteFor(idOption: Nat, amountVotes : Nat) : Bool {
        let testOption = SB.getOpt(polls, idOption);
        switch (testOption) {
            case (?option) {
                option.votes += amountVotes;
                return true;
            };
            case (null) {
                return false;
            }
        }
    };

    // Devuelve todas las opciones de la votacion
    public func getOptions() : [Option] {
        return SB.toArray(polls);
    }
};