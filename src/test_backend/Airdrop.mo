import Principal "mo:base/Principal";
import SHM "libs/FunctionalStableHashMap";
import User "User";

class Airdrop(userOps : User.UserOps){
    //añade amount tokens a los usuarios en whithe list
       public func airDrop(total_tokens: Nat,amount : Nat, wl : SHM.StableHashMap<Principal,User.User>): (Nat, Bool){
        var local_tokens = total_tokens;
        for(user in SHM.vals(wl)) {
            if(amount > local_tokens)return (local_tokens, false);
            let _ = userOps.addBalance(user,amount);
            local_tokens:=local_tokens-amount;
        };
        return (local_tokens,true);
    };
}