import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type TransactionType = { #income; #expense };
  public type OriginalTransaction = {
    id : Nat;
    amount : Nat;
    category : Text;
    description : Text;
    timestamp : Int;
    transactionType : TransactionType;
  };

  public type OriginalBudgetLimit = {
    category : Text;
    limit : Nat;
  };

  public type OldActor = {
    nextTransactionId : Nat;
    transactions : Map.Map<Principal, List.List<OriginalTransaction>>;
    budgetLimits : Map.Map<Principal, List.List<OriginalBudgetLimit>>;
  };

  public type Frequency = {
    #daily;
    #weekly;
    #monthly;
    #yearly;
  };

  public type RecurringTransaction = {
    id : Nat;
    transactionType : TransactionType;
    category : Text;
    amount : Nat;
    description : Text;
    frequency : Frequency;
    startDate : Int;
    endDate : ?Int;
    lastExecutionDate : Int;
    active : Bool;
    lastPeriodicExecution : Int;
  };

  public type NewActor = {
    nextTransactionId : Nat;
    nextRecurringTransactionId : Nat;
    transactions : Map.Map<Principal, List.List<OriginalTransaction>>;
    recurringTransactions : Map.Map<Principal, List.List<RecurringTransaction>>;
    budgetLimits : Map.Map<Principal, List.List<OriginalBudgetLimit>>;
  };

  public func run(old : OldActor) : NewActor {
    {
      nextTransactionId = old.nextTransactionId;
      nextRecurringTransactionId = 0;
      transactions = old.transactions;
      recurringTransactions = Map.empty<Principal, List.List<RecurringTransaction>>();
      budgetLimits = old.budgetLimits;
    };
  };
};
