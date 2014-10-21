package main

import (
  "net/http"
  "fmt"
  "log"
  "encoding/json"
  "github.com/codegangsta/negroni"
  "github.com/julienschmidt/httprouter"
  "github.com/hoisie/mustache"
  "labix.org/v2/mgo"
  "labix.org/v2/mgo/bson"
)

var (
    session *mgo.Session
    collection *mgo.Collection
)

type Starship struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    Name string `json:"name"`
}

type StarshipJSON struct {
    Starship Starship `json:"starship"`
}

type StarshipsJSON struct {
    Starships []Starship `json:"starships"`
}



func renderHTML(template string, context map[string]string) string {
  layoutPath := "templates/layout.hogan"
  templatePath := "templates/" + template + ".hogan"
  return mustache.RenderFileInLayout(templatePath, layoutPath, context)
}

func renderIndex(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
  w.Header().Set("Content-Type", "text/html")
  context := map[string]string{
    "greeting":"Ragnar Station",
  }

  fmt.Fprint(w, renderHTML("index", context))
}

func main() {
  router := httprouter.New()
  router.GET("/", renderIndex)
  router.GET("/api/ships", getAllStarships)
  router.POST("/api/ships", createStarship)
  router.DELETE("/api/ships/:id", deleteStarship)
  router.PUT("/api/ships/:id", updateStarship)

  // log.Println("Starting mongo db session")
  var err error
  session, err = mgo.Dial("localhost")
  if err != nil { panic (err) }
  defer session.Close()
  session.SetMode(mgo.Monotonic, true)
  collection = session.DB("Starships").C("starships")

  n := negroni.Classic()
  n.UseHandler(router)
  n.Run(":3000")
}
