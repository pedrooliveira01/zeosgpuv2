const got = require('got');

export async function getHTML(url:string){
    try {
      const response = await got(url);
      const data = await response.body;
  
      if (response){
        if (response.error) {
            console.log(response.error)
            return 
        } else {
          return data
        }
      }       
    } catch (error) {
      console.log(error.message)
      return 
    }
  }