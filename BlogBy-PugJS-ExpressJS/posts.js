let posts=[
    {
        id:1,
        title:"Tesla recalls 40,000 cars over power-steering fault",
        desc:"Elon Musk's electric-car manufacturer says the vehicles' power-steering assist system may fail on rough roads or after hitting a pothole."
        ,image:"https://ichef.bbci.co.uk/news/976/cpsprodpb/E335/production/_127556185_gettyimages-1231348679.jpg.webp",
        detail:(`Tesla is recalling just over 40,000 cars in the US because of a potential power-steering problem.

        Elon Musk's electric-car manufacturer says the vehicles' power-steering assist system may fail on rough roads or after hitting a pothole.
        
        The National Highway Traffic Safety Administration said it could require greater steering effort, especially at low speeds, increasing crash risks.
        
        Tesla has released a software update to recalibrate the system.
        
        It was unaware of any injuries or deaths in connection with the problem, it said.
        
        However, 314 vehicle alerts have been issued for US vehicles that may be related to the recall.
        
        The recall affects the 2017-21 Model S and Model X vehicles.
        
        Telsa said more than 97% of the recalled vehicles had installed an update that had already addressed the problem.
        
        Separately, Tesla is recalling 53 2021 Model S exterior side rear-view mirrors built for the European market that do not comply with American "rear-visibility" requirements.
        
        Tesla has issued 17 recall notices in 2022, covering 3.4 million vehicles.
        
        In September, it recalled nearly 1.1 million cars in the US because the windows might close too fast and pinch people's fingers.`)
    }
]
const addpost=(id,title,desc,image)=>{
    posts.push({
        id:id,
        title:title,
        desc:desc.slice(0,160),
        image:image,
        detail:desc
    })
}
module.exports={posts,addpost};