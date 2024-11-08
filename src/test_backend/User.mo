import Principal "mo:base/Principal";
//El balance debe ser retornado para poder almacenarlo en un stable
//Cuando se actualiza obtinene el balance (st_balance) por stable
type User = {
    id: Principal;
    var balance : Nat;
};

type SharedUser = {
    id: Principal;
    balance : Nat;
    status : Text;
};

class UserOps(){    
    public func addBalance(user: User, amount : Nat) : (){
        user.balance+=amount;
    };
    public func removeBalance(user : User, amount : Nat) : (){
        user.balance-=amount;
    };
    public func getBalance(user : User) : Nat{
        return user.balance;
    }
}