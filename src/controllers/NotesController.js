const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class NotesController {
  async index(req, res) {
    const { title, tags } = req.query;
    const user_id = req.user.id;

    let notes;

    if (tags) {
      const filterTags = tags
        .split(",") //Converte o texto num array usando como delimitador o parametro (No caso a virgula)
        .map((tag) => tag.trim()); //trim remove os espaços em branco do inicio e/ou fim do texto

      notes = await knex("tags")
        .select(["notes.note_id", "notes.title", "notes.user_id"])
        .whereLike("title", `%${title}%`)
        .whereIn("name", filterTags) //Analisa baseado na tag o nome da tag com o vetor para verificar se a tag existe ali ou não.
        .innerJoin("notes", "notes.note_id", "tags.note_id")
        .groupBy("notes.note_id")
        .orderBy("notes.created_at");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`) //O % verifica a similaridade tanto antes quanto depois caso seja enviado um valor aproximado da consulta de title
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.note_id);
      return {
        ...note,
        tags: noteTags,
      };
    });

    return res.json(notesWithTags);
  }

  async create(req, res) {
    const { title, description, tags, links } = req.body;
    const user_id = req.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    const linksInsert = links.map((link) => {
      return {
        note_id,
        url: link,
      };
    });

    await knex("links").insert(linksInsert);

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });

    await knex("tags").insert(tagsInsert);

    return res.json();
  }

  async show(req, res) {
    const { note_id } = req.params;

    //Pega as Notas
    const note = await knex("notes") //get notes
      .where({ note_id }) //where id = id
      .first(); //Apenas a primeira nota, para evitar pegar as desnecessarias

    //Pega as Tags e Links pra mostrar JUNTO das notas
    const tags = await knex("tags").where({ note_id }).orderBy("name"); //Ordem alfabetica pelo valor name da tabela

    const links = await knex("links").where({ note_id }).orderBy("created_at"); //Ordena pela data de criação
    return res.json({
      ...note,
      tags,
      links,
    });
  }

  async delete(req, res) {
    const { note_id } = req.params;

    const deletedUser = await knex("notes").where({ note_id }).delete();

    return res.json(deletedUser);
  }
}

module.exports = NotesController;
