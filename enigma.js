/* Enigma I / M3 electrical model. Rotor order and positions are left to right.
   Wiring reference: https://www.cryptomuseum.com/crypto/enigma/wiring.htm */
(function(root){
 const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ', wiring={I:'EKMFLGDQVZNTOWYHXUSPAIBRCJ',II:'AJDKSIRUXBLHWTMCQGZNPYFVOE',III:'BDFHJLCPRTXVZNYEIWGAKMUSQO',IV:'ESOVPZJAYQUIRHXLNFTGKDCMWB',V:'VZBRGITYUPSDNHLXAWMJQOFECK'},notch={I:'Q',II:'E',III:'V',IV:'J',V:'Z'},reflectors={B:'YRUHQSLDPXNGOKMIEBFZCWVJAT',C:'FVPJIAOYEDRZXWGCTKUQSBNMHL'};
 function run(text,{rotors=['I','II','III'],rings='AAA',positions='AAA',reflector='B',plugs=''}={}){
  if(rotors.length!==3||new Set(rotors).size!==3||rotors.some(r=>!wiring[r]))throw Error('Kies drie verschillende rotoren.');
  if(!/^[A-Z]{3}$/.test(rings)||!/^[A-Z]{3}$/.test(positions)||!reflectors[reflector])throw Error('Gebruik drie letters A–Z voor ringstand en startpositie.');
  const pairs=plugs.trim()?plugs.trim().toUpperCase().split(/\s+/):[],used=new Set(),pb={};
  for(const pair of pairs){if(!/^[A-Z]{2}$/.test(pair)||pair[0]===pair[1]||[...pair].some(c=>used.has(c)))throw Error('Elk stekkerpaar heeft twee verschillende letters; gebruik elke letter maar eenmaal.');for(const c of pair)used.add(c);pb[pair[0]]=pair[1];pb[pair[1]]=pair[0];}
  if(pairs.length>13)throw Error('Te veel stekkerparen.');
  let p=[...positions].map(c=>A.indexOf(c)),ring=[...rings].map(c=>A.indexOf(c)),output='',steps=[];
  const mod=n=>(n+260)%26;
  for(const char of text.toUpperCase().replace(/[^A-Z]/g,'')){
   const middle=A[p[1]]===notch[rotors[1]],right=A[p[2]]===notch[rotors[2]];
   if(middle)p[0]=mod(p[0]+1);if(middle||right)p[1]=mod(p[1]+1);p[2]=mod(p[2]+1);
   let n=A.indexOf(pb[char]||char);
   for(let i=2;i>=0;i--)n=mod(A.indexOf(wiring[rotors[i]][mod(n+p[i]-ring[i])])-p[i]+ring[i]);
   n=A.indexOf(reflectors[reflector][n]);
   for(let i=0;i<3;i++)n=mod(wiring[rotors[i]].indexOf(A[mod(n+p[i]-ring[i])])-p[i]+ring[i]);
   let out=pb[A[n]]||A[n];output+=out;steps.push({input:char,output:out,position:p.map(n=>A[n]).join('')});
  }return {output,positions:p.map(n=>A[n]).join(''),steps};
 }
 root.Enigma={run};if(typeof module!=='undefined')module.exports={run};
})(typeof window!=='undefined'?window:globalThis);
