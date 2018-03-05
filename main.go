package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"

	_ "github.com/mattn/go-sqlite3"
)

// var (
// 	dbName = "tgsearch.db"
// 	port   = "8082"
// )

type Config struct {
	DbName string
	Port   string
}

func main() {

	var conf Config = Config{"tgsearch.db", "4896"}
	readConfig("config.json", &conf)

	http.HandleFunc("/tgs", func(w http.ResponseWriter, r *http.Request) {
		key := r.FormValue("q")
		Results := search_sqlite(w, key, conf)

		tgfinding := map[string]interface{}{
			"Keyword": key,
			"Results": Results,
		}
		tmpl, err := template.ParseFiles("main.tmpl")
		if err != nil {
			fmt.Fprintf(w, "Parse: %v", err)
			log.Printf("Parse: %v", err)
			return
		}

		err = tmpl.Execute(w, tgfinding)
		if err != nil {
			fmt.Fprintf(w, "Excute: %v", err)
			log.Printf("Excute: %v", err)
			return
		}
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl, err := template.ParseFiles("main.tmpl")
		if err != nil {
			fmt.Fprintf(w, "Parse: %v", err)
			log.Printf("Parse: %v", err)
			return
		}

		err = tmpl.Execute(w, map[string]interface{}{
			"Keyword": "",
		})
		if err != nil {
			fmt.Fprintf(w, "Excute: %v", err)
			log.Printf("Excute: %v", err)
			return
		}
	})

	log.Print("It works! port:" + conf.Port)
	//log.Fatal(http.ListenAndServe(":443", nil))
	log.Fatal(http.ListenAndServe(":"+conf.Port, nil))
}

func search_sqlite(w http.ResponseWriter, keyword string, conf Config) []string {
	db, err := sql.Open("sqlite3", "./"+conf.DbName)
	if err != nil {
		fmt.Fprintf(w, "db open: %v", err)
		return []string{"error"}
	}

	if m, _ := regexp.MatchString("^[a-zA-Z一-龟 ]+$", keyword); !m {
		return []string{"不可以! 请勿包含中英文外的字符..."}
	}

	searchQuery := `SELECT text FROM messages WHERE text LIKE "%` + keyword + `%"`
	rows, err := db.Query(searchQuery)
	if err != nil {
		fmt.Fprintf(w, "db matching: %v", err)
		return []string{"error"}
	}

	result := make([]string, 0, 42)
	for rows.Next() {
		var arow string
		err = rows.Scan(&arow)
		result = append(result, arow)
	}
	return result

}

func readConfig(jsonfile string, conf *Config) {
	raw, err := ioutil.ReadFile(jsonfile)
	if err != nil {
		log.Printf("无法读取 %s 配置\n", jsonfile)
		log.Println(err.Error())
		panic(err)
	}
	json.Unmarshal(raw, conf)
	// log.Println(conf)
}
