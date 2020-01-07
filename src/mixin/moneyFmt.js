export default {
  data() {
    return {
      routes: []
    }
  },
  filters: {
    moneyFmt(value) {
      if (!value) return '0.00';

      let floatPart = ".0000";
      let value2Array = value.toString().split(".");

      // let intPart = Number(value) || 0;
      let intPartFormat = value2Array[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');

      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString();

        // if (floatPart.length === 1) {
        //   return intPartFormat + "." + floatPart + '0';
        // } else {
        //   return intPartFormat + "." + floatPart;
        // }
        switch (floatPart.length) {
          case 1: return intPartFormat + "." + floatPart + '000';
          case 2: return intPartFormat + "." + floatPart + '00';
          case 3: return intPartFormat + "." + floatPart + '0';
          case 4: return intPartFormat + "." + floatPart;
        }
      } else {
        return intPartFormat + floatPart;
      }
    }
  }
}
