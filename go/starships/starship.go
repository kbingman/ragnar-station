package starships

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

type Starship struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    Name string `json:"name"`
}

type StarshipJSON struct {
    Starship Starship `json:"starship"`
}

type StarshipsJSON struct {
    Starships []Starship `json:"starship"`
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

    j, err := json.Marshal(StarshipJSON{Starship: starship})
    if err != nil { panic(err) }
    w.Header().Set("Content-Type", "application/json")
    w.Write(j)
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
    j, err := json.Marshal(StarshipsJSON{Starships: starships})
    if err != nil { panic (err) }
    res.Write(j)
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

    // Update the database
    err = collection.Update(bson.M{"_id":id},
             bson.M{"name":starshipJSON.Starship.Name,
                    "_id": id,
                    })
    if err == nil {
        log.Printf("Updated starship %s name to %s", id, starshipJSON.Starship.Name)
    } else {
      panic(err)
    }
    w.WriteHeader(http.StatusNoContent)
}

func deleteStarship(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    // Grab the starship's id from the incoming url
    var err error
    id := params.ByName("id")

    // Remove it from database
    err = collection.Remove(bson.M{"_id":bson.ObjectIdHex(id)})
    if err != nil { log.Printf("Could not find kitten %s to delete", id)}
    w.WriteHeader(http.StatusNoContent)
}
