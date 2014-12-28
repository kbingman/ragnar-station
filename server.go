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
  Id int `json:"id"`
  Name string `json:"name"`
  Cost float32 `json:"cost"`
  Ep float32 `json:"ep"`
  Mass float32 `json:"mass"`
  // RequiredTechLevel int
}

type Battery struct {
  Id int `json:"id"`
  Name string `json:"name"`
  Count int `json:"count"`
  Cost float32  `json:"cost"`
  Ep float32 `json:"ep"`
  Mass float32 `json:"mass"`
  // EnergyPoints int `json:"energyPoints"`
}

type Configuration struct {
  Id int `json:"id"`
  Name string `json:"name"`
  Cost float32 `json:"cost"`
  Selected bool `json:"selected"`
}

type Starship struct {
  Id bson.ObjectId `bson:"_id" json:"id"`
  Uuid string `json:"uuid"`
  Name string `json:"name"`
  Configuration string `json:"configuration"`
  Armor float32 `json:"armor"`
  Mass int64 `json:"mass"`
  Thrust int64 `json:"thrust"`
  Ep float32 `json:"ep"`
  Reactor int64 `json:"reactor"`
  Price float32 `json:"price"`
  Ftl int64 `json:"ftl"`
  Passengers int64 `json:"passengers"`
  Troops int64 `json:"troops"`
  PrimaryWeapons []Battery `json:"primaryWeapons"`
  PointDefenseWeapons []Battery `json:"pointDefenseWeapons"`
  BatteryWeapons []Battery `json:"batteryWeapons"`
  SmallCraft []Starship `json:"smallCraft"`
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
  err = collection.Update(bson.M{"_id":id}, starshipJSON.Starship)
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
      "armor": result.Armor,
      "uuid": result.Uuid,
      "name": result.Name,
      "configuration": result.Configuration,
      "mass": result.Mass,
      "thrust": result.Thrust,
      "reactor": result.Reactor,
      "ftl": result.Ftl,
      "pointDefenseWeapons": result.PointDefenseWeapons,
      "batteryWeapons": result.BatteryWeapons,
      "primaryWeapons": result.PrimaryWeapons,
    }
    if result.Id.Hex() == id {
      starship = starshipMap
    }
    starships = append(starships, starshipMap)
  }

  configurations := []*Configuration{
    {1, "Needle", 1.2, starship["configuration"] == "Needle"},
    {2, "Wedge", 1.2, starship["configuration"] == "Wedge"},
    {3, "Cone", 1.1, starship["configuration"] == "Cone"},
    {4, "Cylinder", 1, starship["configuration"] == "Cylinder"},
    {5, "Saucer", 0.8, starship["configuration"] == "Saucer"},
    {6, "Sphere", 0.7, starship["configuration"] == "Sphere"},
    {7, "Wheel", 0.6, starship["configuration"] == "Wheel"},
    {8, "Skeletal", 0.5, starship["configuration"] == "Skeletal"},
    {9, "Planetoid", 0.2, starship["configuration"] == "Planetoid"},
  }

  primaryWeapons := []*Weapon{
    {1, "Railgun", 1500, 500, 1000},
    {1, "Railgun", 2500, 500, 2000},
    {1, "Railgun", 4200, 500, 3000},
    {1, "Railgun", 5500, 500, 5000},
    {2, "Mass Driver", 3500, 500, 1200},
    {2, "Mass Driver", 5500, 500, 2500},
    {2, "Mass Driver", 8000, 1000, 5000},
    {3, "Ion Gun", 5000, 800, 1500},
    {3, "Ion Gun", 7000, 1200, 3500},
    {3, "Ion Gun", 10000, 1500, 8000},
  }

  batteryWeapons := []*Weapon{
    {1, "Missile Tubes", 20, 0, 100},
    {2, "Brilliant Pebble Launcher", 30, 0, 100},
    {3, "Railgun", 40, 40, 100},
    {4, "Coilgun", 50, 50, 100},
  }

  pointDefenseWeapons := []*Weapon{
    {1, "Missile", 0.75, 0, 1},
    {2, "Chaff", 0.5, 0, 1},
    {3, "Projectile", 0.5, 0, 1},
    {4, "Pulse Laser", 1.0, 1, 1},
    {5, "Railgun", 2.0, 2, 1},
    {6, "Coilgun", 4.0, 3, 1},
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

func renderSector(w http.ResponseWriter, req *http.Request, params httprouter.Params) {
  context := map[string]interface{}{
    "title": "Sector Map",
  }

  w.Header().Set("Content-Type", "text/html")
  fmt.Fprint(w, renderHTML("canvas", context))
}


func main() {
  router := httprouter.New()

  // HTML Routes
  router.GET("/", renderShip)
  router.GET("/ships/:id", renderShip)
  router.GET("/sector", renderSector)

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
