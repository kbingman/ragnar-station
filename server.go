package main

import (
  "net/http"
  "fmt"
  "log"
  "path"
  "os"
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

type Weapon struct {
  Id int64
  Name string
  // CostFactor int64
  // RequiredTechLevel int64
}

type Configuration struct {
  Id int64
  Name string
  Selected bool
  // CostFactor int64
}

type Starship struct {
  Id bson.ObjectId `bson:"_id" json:"id"`
  Uuid string `json:"uuid"`
  Name string `json:"name"`
  Configuration string `json:"configuration"`
  Mass int64 `json:"mass"`
  Thrust int64 `json:"thrust"`
  Reactor int64 `json:"reactor"`
  Ftl int64 `json:"ftl"`
  PrimaryWeapon Weapon `json:"primaryWeapon"`
  PointDefenseWeapons []Weapon `json:"pointDefenseWeapons"`
  BatteryWeapons []Weapon `json:"batteryWeapons"`
  SmallCraft []Starship `json:"smallCraft"`
}

type StarshipMustache struct {
  id string
  name string
  configuration string
  mass int64
  thrust int64
  ftl int64
}

type StarshipJSON struct {
  Starship Starship `json:"starship"`
}

type StarshipsJSON struct {
  Starships []Starship `json:"starships"`
}

func createStarship(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {

    var starshipJSON StarshipJSON

    err := json.NewDecoder(req.Body).Decode(&starshipJSON)
    if err != nil { panic(err) }

    starship := starshipJSON.Starship

    // Store the new starship in the database
    // First, let's get a new id
    obj_id := bson.NewObjectId()
    starship.Id = obj_id

    err = collection.Insert(&starship)
    if err != nil {
        panic(err)
    } else {
        log.Printf("Inserted new starship %s with name %s", starship.Id, starship.Name)
    }

    json, err := json.Marshal(StarshipJSON{Starship: starship})
    if err != nil { panic(err) }

    w.Header().Set("Content-Type", "application/json")
    w.Write(json)
}

func getAllStarships(res http.ResponseWriter, req *http.Request, _ httprouter.Params) {

    // Let's build up the starships slice
    var starships []Starship

    iter := collection.Find(nil).Iter()
    result := Starship{}
    for iter.Next(&result) {
        starships = append(starships, result)
    }

    res.Header().Set("Content-Type", "application/json")
    json, err := json.Marshal(StarshipsJSON{Starships: starships})
    if err != nil { panic (err) }
    res.Write(json)
    log.Println("Provided json")

}

func updateStarship(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
  var err error
  // Grab the starship's id from the incoming url
  id := bson.ObjectIdHex(params.ByName("id"))

  // Decode the incoming starship json
  var starshipJSON StarshipJSON
  err = json.NewDecoder(r.Body).Decode(&starshipJSON)
  if err != nil {panic(err)}

  starship := starshipJSON.Starship
  starship.Id = id

  // Update the database
  err = collection.Update(bson.M{"_id":id},
    bson.M{
        "name": starshipJSON.Starship.Name,
        "uuid": starshipJSON.Starship.Uuid,
        "mass": starshipJSON.Starship.Mass,
        "thrust": starshipJSON.Starship.Thrust,
        "reactor": starshipJSON.Starship.Reactor,
        "ftl": starshipJSON.Starship.Ftl,
        "configuration": starshipJSON.Starship.Configuration,
        "_id": id,
    })
  if err == nil {
    log.Printf("Updated starship %s name to %s", id, starshipJSON.Starship.Name)
  } else {
    panic(err)
  }
  json, err := json.Marshal(StarshipJSON{Starship: starship})
  if err != nil { panic(err) }
  w.Header().Set("Content-Type", "application/json")
  w.Write(json)
}

func deleteStarship(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
  // Grab the starship's id from the incoming url
  var err error
  id := params.ByName("id")

  // Remove it from database
  err = collection.Remove(bson.M{"_id":bson.ObjectIdHex(id)})
  if err != nil { log.Printf("Could not find starship %s to delete", id)}
  w.WriteHeader(http.StatusNoContent)
}

func renderHTML(template string, context map[string]interface{}) string {
  layoutPath := "templates/layout.hogan"
  filename := path.Join(path.Join(os.Getenv("PWD"), "templates"), template + ".hogan")
  return mustache.RenderFileInLayout(filename, layoutPath, context)
}

func renderShip(w http.ResponseWriter, req *http.Request, params httprouter.Params) {

  var starshipMap map[string]interface{}
  var starships []map[string]interface{}
  var starship map[string]interface{}

  id := params.ByName("id")
  iter := collection.Find(nil).Iter()
  result := Starship{}

  for iter.Next(&result) {
    // Make a mustache friendly map for each starship
    starshipMap = map[string]interface{}{
      "id": result.Id.Hex(),
      "uuid": result.Uuid,
      "name": result.Name,
      "configuration": result.Configuration,
      "mass": result.Mass,
      "thrust": result.Thrust,
      "reactor": result.Reactor,
      "ftl": result.Ftl,
    }
    if result.Id.Hex() == id {
      starship = starshipMap
    }
    starships = append(starships, starshipMap)
  }

  configurations := []*Configuration{
    {1, "Needle", starship["configuration"] == "Needle"},
    {2, "Wedge", starship["configuration"] == "Wedge"},
    {3, "Sphere", starship["configuration"] == "Sphere"},
    {4, "Wheel", starship["configuration"] == "Wheel"},
    {6, "Skeletal", starship["configuration"] == "Skeletal"},
    {5, "Planetoid", starship["configuration"] == "Planetoid"},
  }

  primaryWeapons := []*Weapon{
    {1, "Missle Tubes"},
    {2, "Railgun"},
    {3, "Mass Driver"},
    {4, "Particle Accerator"},
  }

  batteryWeapons := []*Weapon{
    {1, "Missle Launcher"},
    {2, "Beam Laser"},
    {3, "Railgun"},
    {4, "Gauss Gun"},
  }

  pointDefenseWeapons := []*Weapon{
    {2, "Projectile"},
    {2, "Beam Laser"},
    {4, "Gauss Gun"},
  }

  context := map[string]interface{}{
    "title": "Ragnar Station",
    "configurations": configurations,
    "starships": starships,
    "starship": starship,
    "primaryWeapons": primaryWeapons,
    "batteryWeapons": batteryWeapons,
    "pointDefenseWeapons": pointDefenseWeapons,
  }

  w.Header().Set("Content-Type", "text/html")
  fmt.Fprint(w, renderHTML("index", context))
}


func main() {
  router := httprouter.New()

  // HTML Routes
  router.GET("/", renderShip)
  router.GET("/ships/:id", renderShip)

  // JSON API routes
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
