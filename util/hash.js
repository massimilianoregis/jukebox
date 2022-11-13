String.prototype.hash=
 function() {
    var hash = 5381,
        i    = this.length;
  
    while(i) {
      hash = (hash * 33) ^ this.charCodeAt(--i);
    }
  
    return hash >>> 0;
  }