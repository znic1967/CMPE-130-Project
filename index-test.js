// Copyright 2010 Jonas Elfström. All rights reserved.

    // Redistribution and use in source and binary forms, with or without modification, are
    // permitted provided that the following conditions are met:

    //    1. Redistributions of source code must retain the above copyright notice, this list of
    //       conditions and the following disclaimer.

    //    2. Redistributions in binary form must reproduce the above copyright notice, this list
    //       of conditions and the following disclaimer in the documentation and/or other materials
    //       provided with the distribution.

    // THIS SOFTWARE IS PROVIDED BY JONAS ELFSTRÖM ``AS IS'' AND ANY EXPRESS OR IMPLIED
    // WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
    // FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JONAS ELFSTRÖM OR
    // CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
    // CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    // SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
    // ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    // NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
    // ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    // The views and conclusions contained in the software and documentation are those of the
    // authors and should not be interpreted as representing official policies, either expressed
    // or implied, of Jonas Elfström. 


      var img = new Image();
      img.src = 'img/kafka160120.jpg';

      var sImg = new Image();
      sImg.src = 'img/scrambled.png';
      //img.crossOrigin = "null";
      var width=160;
      var height=120;
      var ctx, imgd, pix;
      
      img.onload = function() {
        ctx = document.getElementById('leif').getContext('2d');
        ctx.drawImage(img, 0, 0);
        imgd = ctx.getImageData(0,0,width,height);
        pix = imgd.data;
      }

      function clear_canvas() {
        ctx.clearRect(0,0,160,120);
        imgd.data=[];
      }

      function canvasArrToString(a) {
        var s="";
        // Removes alpha to save space.
        for (var i=0; i<pix.length; i+=4) {
          s+=(String.fromCharCode(pix[i]) 
              + String.fromCharCode(pix[i+1]) 
              + String.fromCharCode(pix[i+2]));
        }
        return s;
      }

      function canvasStringToArr(s) {
        var p=[];
        for (var i=0; i<s.length; i+=3) {
          for (var j=0; j<3; j++) {
            p.push(s.substring(i+j,i+j+1).charCodeAt());
          } 
          p.push(255); // Hardcodes alpha to 255.
        }
        return p;
      }

      function encryptAES() {
        var password = document.getElementById('password').value;
        var s=canvasArrToString(pix);
        var encrypted = Krypto.AES.encrypt(s, password);
        document.getElementById('ta').value=encrypted;
        document.getElementById('chars').innerHTML=""+encrypted.length+" characters.";
        //clear_canvas();
        ctx.drawImage(sImg, 0, 0);
      }

      function decryptAES() {
        var password = document.getElementById('password').value;
        var arr=canvasStringToArr(Krypto.AES.decrypt(document.getElementById('ta').value, password));
        for (var i=0; i<arr.length; i++) { arr[i]-=0; }
        pix=arr;
        imgd.data=pix;
        ctx.putImageData(imgd,0,0);
        document.getElementById('ta').value="";
      }
