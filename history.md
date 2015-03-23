# Changes

## Concat
<!---
I'm not native Eanglish speeker. Feel free to change the text. 
-->

Change the way of reverse the Buffer. Previously the solution uses: 

```js
  var s = src.toString().split('').reverse().join('');
```

There is no need to convert to String and there be performance issues. 

The Buffer is an "Array like object" so you can use Array.prototype.reverse()

```js
  Array.prototype.reverse.call(src);
```

Then also change the way of return the text using process.stodut instead of console.log