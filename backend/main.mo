import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type TransactionType = { #income; #expense };
  public type Frequency = {
    #daily;
    #weekly;
    #monthly;
    #yearly;
  };

  public type Transaction = {
    id : Nat;
    amount : Nat;
    category : Text;
    description : Text;
    timestamp : Time.Time;
    transactionType : TransactionType;
  };

  public type RecurringTransaction = {
    id : Nat;
    transactionType : TransactionType;
    category : Text;
    amount : Nat;
    description : Text;
    frequency : Frequency;
    startDate : Time.Time;
    endDate : ?Time.Time;
    lastExecutionDate : Time.Time;
    active : Bool;
    lastPeriodicExecution : Time.Time;
  };

  public type BudgetLimit = {
    category : Text;
    limit : Nat;
  };

  var nextTransactionId = 0;
  var nextRecurringTransactionId = 0;
  let transactions = Map.empty<Principal, List.List<Transaction>>();
  let recurringTransactions = Map.empty<Principal, List.List<RecurringTransaction>>();
  let budgetLimits = Map.empty<Principal, List.List<BudgetLimit>>();

  var lastPeriodicRun : Time.Time = 0;

  // Expanded income categories as query functions
  public query ({ caller }) func getIncomeCategories() : async [Text] {
    [
      "Salary",
      "Business",
      "Investments",
      "Extra income",
      "Deposits",
      "Rental Income",
      "Freelance",
      "Dividends",
      "Interest",
      "Bonuses",
      "Gifts",
      "Refunds",
    ];
  };

  // Expanded expense categories as query functions
  public query ({ caller }) func getExpenseCategories() : async [Text] {
    [
      "Bills",
      "Car",
      "Clothes",
      "Travel",
      "Shopping",
      "House",
      "Entertainment",
      "Food & Dining",
      "Healthcare",
      "Education",
      "Insurance",
      "Utilities",
      "Subscriptions",
      "Personal Care",
      "Pets",
      "Miscellaneous",
    ];
  };

  module Transaction {
    public func compare(tx1 : Transaction, tx2 : Transaction) : Order.Order {
      Nat.compare(tx1.id, tx2.id);
    };
  };

  func getUserTransactions(caller : Principal) : List.List<Transaction> {
    switch (transactions.get(caller)) {
      case (?userTransactions) { userTransactions };
      case (null) { List.empty<Transaction>() };
    };
  };

  func getUserRecurringTransactions(caller : Principal) : List.List<RecurringTransaction> {
    switch (recurringTransactions.get(caller)) {
      case (?userRecurringTransactions) { userRecurringTransactions };
      case (null) { List.empty<RecurringTransaction>() };
    };
  };

  func getUserBudgetLimits(caller : Principal) : List.List<BudgetLimit> {
    switch (budgetLimits.get(caller)) {
      case (?userBudgetLimits) { userBudgetLimits };
      case (null) { List.empty<BudgetLimit>() };
    };
  };

  public shared ({ caller }) func addTransaction(amount : Nat, category : Text, description : Text, transactionType : TransactionType) : async Nat {
    let transaction = {
      id = nextTransactionId;
      amount;
      category;
      description;
      timestamp = Time.now();
      transactionType;
    };

    let userTransactions = getUserTransactions(caller);
    userTransactions.add(transaction);
    transactions.add(caller, userTransactions);

    nextTransactionId += 1;
    transaction.id;
  };

  public shared ({ caller }) func addRecurringTransaction(
    category : Text,
    amount : Nat,
    description : Text,
    transactionType : TransactionType,
    frequency : Frequency,
    startDate : Time.Time,
    endDate : ?Time.Time,
  ) : async Nat {
    let recurringTransaction : RecurringTransaction = {
      id = nextRecurringTransactionId;
      category;
      amount;
      description;
      transactionType;
      frequency;
      startDate;
      endDate;
      lastExecutionDate = 0;
      active = true;
      lastPeriodicExecution = 0;
    };

    let userRecurringTransactions = getUserRecurringTransactions(caller);
    userRecurringTransactions.add(recurringTransaction);
    recurringTransactions.add(caller, userRecurringTransactions);

    nextRecurringTransactionId += 1;
    recurringTransaction.id;
  };

  public shared ({ caller }) func updateRecurringTransaction(
    id : Nat,
    category : Text,
    amount : Nat,
    description : Text,
    transactionType : TransactionType,
    frequency : Frequency,
    startDate : Time.Time,
    endDate : ?Time.Time,
  ) : async () {
    let userRecurringTransactions = getUserRecurringTransactions(caller);
    let updatedRecurringTransactions = userRecurringTransactions.map<RecurringTransaction, RecurringTransaction>(
      func(rt) {
        if (rt.id == id) {
          return {
            rt with
            category;
            amount;
            description;
            transactionType;
            frequency;
            startDate;
            endDate;
          };
        };
        rt;
      }
    );
    recurringTransactions.add(caller, updatedRecurringTransactions);
  };

  public shared ({ caller }) func deleteRecurringTransaction(id : Nat) : async () {
    let userRecurringTransactions = getUserRecurringTransactions(caller);
    let filteredRecurringTransactions = userRecurringTransactions.filter(func(rt) { rt.id != id });
    recurringTransactions.add(caller, filteredRecurringTransactions);
  };

  public shared ({ caller }) func updateTransaction(id : Nat, amount : Nat, category : Text, description : Text) : async () {
    let userTransactions = getUserTransactions(caller);
    let updatedTransactions = userTransactions.map<Transaction, Transaction>(
      func(tx) {
        if (tx.id == id) {
          return {
            id = tx.id;
            amount;
            category;
            description;
            timestamp = tx.timestamp;
            transactionType = tx.transactionType;
          };
        };
        tx;
      }
    );
    transactions.add(caller, updatedTransactions);
  };

  public shared ({ caller }) func deleteTransaction(id : Nat) : async () {
    let userTransactions = getUserTransactions(caller);
    let filteredTransactions = userTransactions.filter(func(tx) { tx.id != id });
    transactions.add(caller, filteredTransactions);
  };

  public shared ({ caller }) func addBudgetLimit(category : Text, limit : Nat) : async () {
    let userBudgetLimits = getUserBudgetLimits(caller);
    let updatedLimits = userBudgetLimits.filter(func(b) { b.category != category });
    updatedLimits.add({ category; limit });
    budgetLimits.add(caller, updatedLimits);
  };

  public shared ({ caller }) func deleteBudgetLimit(category : Text) : async () {
    let userBudgetLimits = getUserBudgetLimits(caller);
    let filteredLimits = userBudgetLimits.filter(func(b) { b.category != category });
    budgetLimits.add(caller, filteredLimits);
  };

  public shared ({ caller }) func toggleRecurringTransactionActive(id : Nat) : async Bool {
    let userRecurringTransactions = getUserRecurringTransactions(caller);
    let updatedRecurringTransactions = userRecurringTransactions.map<RecurringTransaction, RecurringTransaction>(
      func(rt) {
        if (rt.id == id) {
          return {
            rt with active = not rt.active;
          };
        };
        rt;
      }
    );
    recurringTransactions.add(caller, updatedRecurringTransactions);
    switch (updatedRecurringTransactions.find(func(rt) { rt.id == id })) {
      case (?rt) { rt.active };
      case (null) { false };
    };
  };

  public query ({ caller }) func getUserTransactionsQuery() : async [Transaction] {
    getUserTransactions(caller).toArray();
  };

  public query ({ caller }) func getUserRecurringTransactionsQuery() : async [RecurringTransaction] {
    getUserRecurringTransactions(caller).toArray();
  };

  public query ({ caller }) func getUserBudgetLimitsQuery() : async [BudgetLimit] {
    getUserBudgetLimits(caller).toArray();
  };

  public query ({ caller }) func getIncome() : async [Transaction] {
    let userTransactions = getUserTransactions(caller);
    let income = userTransactions.filter(func(tx) { tx.transactionType == #income });
    income.toArray();
  };

  public query ({ caller }) func getExpenses() : async [Transaction] {
    let userTransactions = getUserTransactions(caller);
    let expenses = userTransactions.filter(func(tx) { tx.transactionType == #expense });
    expenses.toArray();
  };

  public query ({ caller }) func getTransactionsByCategory(category : Text) : async [Transaction] {
    let userTransactions = getUserTransactions(caller);
    let filtered = userTransactions.filter(func(tx) { tx.category == category });
    filtered.toArray();
  };

  public query ({ caller }) func getTransactionsByType(transactionType : TransactionType) : async [Transaction] {
    let userTransactions = getUserTransactions(caller);
    let filtered = userTransactions.filter(func(tx) { tx.transactionType == transactionType });
    filtered.toArray();
  };

  func getAllUserTransactions() : List.List<Transaction> {
    let allTransactions = List.empty<Transaction>();
    let userTransactionsValues = transactions.values();
    for (userTransactions in userTransactionsValues) {
      allTransactions.addAll(userTransactions.values());
    };
    allTransactions;
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    let allTransactions = getAllUserTransactions();
    allTransactions.toArray().sort();
  };

  func getAllUserRecurringTransactions() : List.List<RecurringTransaction> {
    let allRecurringTransactions = List.empty<RecurringTransaction>();
    let userRecurringTransactionsValues = recurringTransactions.values();
    for (userRecurringTransactions in userRecurringTransactionsValues) {
      allRecurringTransactions.addAll(userRecurringTransactions.values());
    };
    allRecurringTransactions;
  };

  public query ({ caller }) func getAllRecurringTransactions() : async [RecurringTransaction] {
    getAllUserRecurringTransactions().toArray();
  };

  // Automatic Transaction Generation

  func shouldProcessRecurringTransaction(recurringTransaction : RecurringTransaction) : Bool {
    let currentTime = Time.now();
    if (not recurringTransaction.active) { return false };
    if (currentTime < recurringTransaction.startDate) { return false };
    switch (recurringTransaction.endDate) {
      case (?endDate) {
        if (currentTime > endDate) { return false };
      };
      case (null) {};
    };

    let timeSinceLast = currentTime - recurringTransaction.lastExecutionDate;
    switch (recurringTransaction.frequency) {
      case (#daily) { timeSinceLast >= 24 * 60 * 60 * 1000000000 };
      case (#weekly) { timeSinceLast >= 7 * 24 * 60 * 60 * 1000000000 };
      case (#monthly) { timeSinceLast >= 30 * 24 * 60 * 60 * 1000000000 };
      case (#yearly) { timeSinceLast >= 365 * 24 * 60 * 60 * 1000000000 };
    };
  };

  func convertRecurringToTransaction(recurringTransaction : RecurringTransaction) : Transaction {
    {
      id = nextTransactionId;
      amount = recurringTransaction.amount;
      category = recurringTransaction.category;
      description = recurringTransaction.description;
      timestamp = Time.now();
      transactionType = recurringTransaction.transactionType;
    };
  };

  public shared ({ caller }) func processRecurringTransactions() : async () {
    let allRecurringTransactions = getAllUserRecurringTransactions();
    let now = Time.now();

    let processed = allRecurringTransactions.filter(func(rt) { shouldProcessRecurringTransaction(rt) });
    for (processedRecurringTransaction in processed.values()) {
      let transaction = convertRecurringToTransaction(processedRecurringTransaction);

      // Find correct user for recurring transactions
      let principal = recurringTransactions.entries().find(
        func((principal, transactions)) {
          transactions.any((func(rt) { rt.id == processedRecurringTransaction.id }));
        }
      );

      switch (principal) {
        case (?principal) {
          let userTransactions = getUserTransactions(principal.0);
          userTransactions.add(transaction);
          transactions.add(principal.0, userTransactions);

          let userRecurringTransactions = getUserRecurringTransactions(principal.0);
          let updatedRecurringTransactions = userRecurringTransactions.map<RecurringTransaction, RecurringTransaction>(
            func(rt) {
              let newTransaction = {
                rt with lastExecutionDate = now;
              };
              if (rt.id == processedRecurringTransaction.id) {
                return newTransaction;
              };
              rt;
            }
          );
          recurringTransactions.add(principal.0, updatedRecurringTransactions);
        };
        case (null) {};
      };
    };
  };
};
