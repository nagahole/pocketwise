String.prototype.capitalize = function() {
  if (this.length === 0) return this;
  else if (this.length === 1) return this.toUpperCase();
  else return this[0].toUpperCase() + this.substring(1, this.length);
}