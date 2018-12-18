(function(){
    localStorage.setItem('name','Pramod');
    const name = localStorage.getItem('name');
    let h1 = document.querySelector('#title');
    name ? h1.textContent = `Welcome ${name}` : h1.textContent = 'Sorry no name set!';
}());//IIFE