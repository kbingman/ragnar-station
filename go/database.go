// signatures/database.go

package signatures

import (
  "labix.org/v2/mgo"
)

/*
I want to use a different database for my tests,
so I'll embed *mgo.Session and store the database name.
*/
type DatabaseSession struct {
  *mgo.Session
  databaseName string
}

/*
Connect to the local MongoDB and set up the database.
*/
func NewSession(name string) *DatabaseSession {
  session, err := mgo.Dial("mongodb://localhost")
  if err != nil {
    panic(err)
  }

  addIndexToStarships(session.DB(name))
  return &DatabaseSession{session, name}
}

/*
Add a unique index on the "email" field.
This doesn't prevent users from signing twice,
since they can still enter
"dudebro+signature2@exmaple.com". But if they're
that clever, I say they deserve the extra signature.
*/
func addIndexToStarships(db *mgo.Database) {
  index := mgo.Index{
    Key:      []string{"name"},
    Unique:   true,
    DropDups: true,
  }
  indexErr := db.C("starships").EnsureIndex(index)
  if indexErr != nil {
    panic(indexErr)
  }
}
