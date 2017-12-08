## Functions

<dl>
<dt><a href="#printo">printo(obj, [options])</a> ⇒ <code>object</code></dt>
<dd><p>Turn any javascript object into a serializable object</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#functionFormatter">functionFormatter</a> ⇒ <code>string</code></dt>
<dd><p>Function that turn functions into strings</p>
</dd>
<dt><a href="#formatter">formatter</a> ⇒ <code><a href="#formatterResult">formatterResult</a></code></dt>
<dd><p>Function that formats every object</p>
</dd>
<dt><a href="#formatterResult">formatterResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#pointerFormatter">pointerFormatter</a> ⇒ <code>string</code></dt>
<dd><p>Function that formats the value of already visited objects</p>
</dd>
</dl>

<a name="printo"></a>

## printo(obj, [options]) ⇒ <code>object</code>
Turn any javascript object into a serializable object

**Kind**: global function  
**Returns**: <code>object</code> - A serializable object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>any</code> |  | Any Javascript variable |
| [options] | <code>object</code> |  | Options used |
| [options.maxDepth] | <code>number</code> \| <code>null</code> | <code></code> | Max depth the function should traverse |
| [options.skipPrototype] | <code>boolean</code> | <code>false</code> | Set to true to not enumerate properties from prototype |
| [options.rootKey] | <code>string</code> | <code>&quot;root&quot;</code> | Name use to represent the top level variable |
| [options.formatter] | [<code>formatter</code>](#formatter) |  | Function used to format each key, value in the final JSON |
| [options.pointerFormatter] | [<code>pointerFormatter</code>](#pointerFormatter) |  | Function used to format the pointers path |
| [options.functionFormatter] | [<code>functionFormatter</code>](#functionFormatter) |  | Function used to turn functions into strings |

<a name="functionFormatter"></a>

## functionFormatter ⇒ <code>string</code>
Function that turn functions into strings

**Kind**: global typedef  
**Returns**: <code>string</code> - A printable string  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A function |

<a name="formatter"></a>

## formatter ⇒ [<code>formatterResult</code>](#formatterResult)
Function that formats every object

**Kind**: global typedef  
**Returns**: [<code>formatterResult</code>](#formatterResult) - An object containing a key:string and a val:string property  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | The actual object reference |
| prop | <code>string</code> | Name of the property |
| type | <code>string</code> | Type of the value |
| value | <code>any</code> | Printable value |
| constructorName | <code>string</code> | Name of the constructor if it is an object |
| path | <code>Array</code> | Array containing the path of parent properties |
| isPrototype | <code>boolean</code> | If this property comes from the prototype |
| isPointer | <code>boolean</code> | If this property is a reference to an already visited object |
| maxDepth | <code>boolean</code> | If maxDepth is reatched |

<a name="formatterResult"></a>

## formatterResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Value stored on the key |
| val | <code>string</code> | Value stored on the value |

<a name="pointerFormatter"></a>

## pointerFormatter ⇒ <code>string</code>
Function that formats the value of already visited objects

**Kind**: global typedef  
**Returns**: <code>string</code> - Return a string  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>any</code> | The actual object reference |
| path | <code>Array</code> | Array containing the path of parent properties |

