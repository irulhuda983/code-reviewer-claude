# Hook/Utility Design Principles (React/TS)

## 1. Separation of Concerns (Single Responsibility)

**Principle:** Each module/hook/function should have  **ONE clear responsibility** .

**Examples:**

* ❌ Bad: One hook handling both browser navigation **AND** tab close events
* ✅ Good: Split into `useUnsavedChanges` (navigation) and `useBeforeUnload` (tab close)

**Rule:**
When creating hooks or utilities that handle multiple event types or concerns, split them into  **separate focused modules** . Each should have a single, well-defined purpose that can be described in  **one sentence** .

---

## 2. Declarative Over Imperative APIs

**Principle:** Prefer declarative boolean parameters over imperative callback methods.

**Examples:**

* ❌ Bad: `markAsUnsaved()`, `markAsSaved()` callbacks
* ✅ Good: `useHook(hasUnsavedChanges: boolean)` parameter

Design APIs that accept state as parameters (declarative) rather than requiring manual state updates via callbacks (imperative). This makes the data flow explicit and easier to reason about.

**Rule:**

* Prefer: `useHook(condition: boolean)`
* Over: `const { setCondition } = useHook(); setCondition(true)`

---

## 3. Refs for Event Listeners (Avoid Stale Closures)

**Principle:** Use refs to store values accessed within event listeners to avoid stale closures and unnecessary re-registrations.

**Pattern:**

```ts
const valueRef = useRef(value);

// Sync ref with prop/state
useEffect(() => {
  valueRef.current = value;
}, [value]);

// Register listener ONCE with empty deps
useEffect(() => {
  const handler = () => {
    // Always reads fresh value via ref
    if (valueRef.current) {
      /* ... */
    }
  };

  window.addEventListener('event', handler);
  return () => window.removeEventListener('event', handler);
}, []); // Empty deps - no re-registration
```

**Rule:**
When creating event listeners that need to access component state:

1. Store the state in a ref
2. Sync ref in `useEffect` with state as dependency
3. Register event listener **ONLY ONCE** (empty dependency array)
4. Access `ref.current` inside the event handler

This prevents stale closures and performance issues from re-registering listeners.

---

## 4. State Machines for Complex Flows

**Principle:** Use multiple flag refs to track different states in complex async/event-driven flows.

**Pattern:**

```ts
const isHandlingRef = useRef(false);
const isRestoringRef = useRef(false);
const hasConfirmedRef = useRef(false);

const handler = () => {
  // Guard: skip if already handling
  if (isHandlingRef.current) return;

  // Guard: skip if this is a programmatic event
  if (isRestoringRef.current) {
    isRestoringRef.current = false;
    return;
  }

  // Handle the actual logic
  isHandlingRef.current = true;
  // ... do work ...
  isHandlingRef.current = false;
};
```

**Rule:**
For complex event flows (especially browser navigation, async operations):

1. Identify all possible states (handling, restoring, confirmed, etc.)
2. Use separate ref flags for each state
3. Use guard clauses at the start of handlers to skip invalid states
4. Update flags at appropriate points in the flow
5. Always reset flags after operations complete

Common flags: `isHandlingRef`, `isProcessingRef`, `isRestoringRef`, `hasConfirmedRef`, `hasPushedStateRef`.

---

## 5. Parent-Controlled State (Controlled Components)

**Principle:** Let parent components compute and control state; hooks should only observe.

**Pattern:**

```ts
// Parent computes state
function Parent() {
  const [data, setData] = useState(...);
  const hasUnsaved = useMemo(() => {
    return data !== initialData; // Custom logic
  }, [data, initialData]);

  // Pass computed state to hook
  useUnsavedChanges(hasUnsaved);

  return <Child onChange={setData} />;
}
```

**Rule:**
When creating reusable hooks:

* Accept computed boolean/value parameters, not raw data
* Let the parent component handle the computation logic
* Don't hide state management inside hooks
* Make the hook a pure "observer" that reacts to state

This provides:

* Flexibility for different computation logic
* Explicit data flow
* Easier testing
* Better reusability

---

## 6. Explicit Type Safety Over Unions

**Principle:** Avoid union types that require runtime type checking or casting. Use separate, well-typed functions instead.

**Examples:**

* ❌ Bad: `update(type: "nodes" | "edges", data: Node[] | Edge[])`
* ✅ Good: `updateNodes(nodes: Node[])` and `updateEdges(edges: Edge[])`

**Rule:**
When a function can operate on multiple types:

1. Check if the types have fundamentally different behavior
2. If yes, split into separate functions with specific types
3. If no, use generics with proper constraints

Avoid: `function(type: string, data: TypeA | TypeB)`
Prefer: `functionForA(data: TypeA)`, `functionForB(data: TypeB)`

---

## 7. Extract Validation Logic to Named Functions

**Principle:** Complex conditionals should be extracted into well-named helper functions.

**Examples:**

* ❌ Bad: `if (changes.every((c) => ["select", "position"].includes(c.type)))`
* ✅ Good: `if (isSubstantialChange(changes))`

**Rule:**
When writing conditional logic:

1. If the condition is longer than one line, extract it
2. Name the function to describe **WHAT** is being checked, not **HOW**
3. Place helper functions near where they're used

Good names: `isValid`, `hasUnsavedChanges`, `shouldTrack`, `canProceed`
Bad names: `check`, `validate`, `test`, `helper`

---

## 8. Async/Timing with `setTimeout` Pattern

**Principle:** Use `setTimeout` to ensure async operations complete before triggering dependent actions.

**Pattern:**

```ts
const handleAction = () => {
  isProcessingRef.current = true;

  // Let current event loop complete
  setTimeout(() => {
    performAction();
    isProcessingRef.current = false;
  }, 0);
};
```

**Rule:**
When dealing with browser APIs that trigger additional events (history, focus):

1. Set flag immediately to prevent re-entrance
2. Use `setTimeout(fn, 0)` to defer the action to next tick
3. This ensures current event completes before triggering new ones
4. Reset flags after the deferred action completes

Use cases: history manipulation, focus management, scroll operations.

---

## 9. Cleanup and Reset Patterns

**Principle:** Always clean up event listeners and reset flags when component unmounts or state changes.

**Pattern:**

```ts
useEffect(() => {
  const handler = () => {
    /* ... */
  };
  window.addEventListener('event', handler);

  // Cleanup
  return () => {
    window.removeEventListener('event', handler);
    // Reset any flags if needed
    flagRef.current = false;
  };
}, [deps]);

// Reset dependent flags when main state changes
useEffect(() => {
  if (!mainCondition) {
    dependentFlagRef.current = false;
  }
}, [mainCondition]);
```

**Rule:**
Always include cleanup logic:

1. Remove event listeners in `useEffect` return
2. Cancel pending timeouts/intervals
3. Reset flags to initial state
4. Clean up refs that point to DOM elements

Also reset dependent state when main state changes:

* If `hasUnsaved` becomes false, reset `hasConfirmed`
* If `isOpen` becomes false, reset `isAnimating`

---

## 10. Comments for "Why" Not "What"

**Principle:** Code should be self-documenting for "what", comments explain "why".

**Examples:**

* ❌ Bad: `// Set flag to true`
* ✅ Good: `// Prevent re-entrance during confirm dialog`

**Rule:**
Add comments that explain:

* Why a particular approach was chosen
* What edge cases are being handled
* Why something might look counterintuitive
* Business logic or requirements

Don't comment:

* What the code does (use descriptive names instead)
* Obvious syntax
* Implementation details that are clear from the code
