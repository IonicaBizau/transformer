## Documentation

You can see below the API reference of this module.

### `transformer(data, opts)`
Transformer
Transforms the data using synchronous and asynchronous functions.

#### Params
- **Object** `data`: The data object.
- **Object** `opts`: The options object:
 - `autostart` (Boolean): If `true`, the functions will be executed,
   without calling the `start()` method.

#### Return
- **Number** Return description.

### `add(fn, type)`
Adds a new function.

There are three levels where the functions are added to be executed:

Parallel:               | <0: [.............................................]>
Unordered (don't wait): |                                <4a: [........]>
                        +                                <4b: [....]>
                        +                                <4c: [......]>
Ordered (wait):         | <1: [...]> <2: [.]> <3:[.....]>                <5: [....]>

#### Params
- **Function|Transformer** `fn`: The function to add. Note you can add an existing transformer instance as well.
- **TransformerType** `type`: One of the following:
   - `Transformer.PARALLEL`: Used to append on the parallel timeline.
   - `Transformer.UNORDERED`: Grouped, but unordered.
   - `Transformer.ORDERED`: Grouped, but ordered.

#### Return
- **Transformer** The current Transformer instance.

### `start(data, fn)`
Starts the function execution.

#### Params
- **Object** `data`: The data object.
- **Function** `fn`: The callback function.

