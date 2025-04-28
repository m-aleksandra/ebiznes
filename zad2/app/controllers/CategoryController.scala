package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Category

@Singleton
class CategoryController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {
  private var categories = List(
    Category(1, "Clothes"),
    Category(2, "Shoes")
  )

  implicit val categoryFormat: OFormat[Category] = Json.format[Category]

  def getAll = Action {
    Ok(Json.toJson(categories))
  }

  def getById(id: Long) = Action {
    categories.find(_.id == id)
      .map(c => Ok(Json.toJson(c)))
      .getOrElse(NotFound)
  }

  def add = Action(parse.json) { request =>
    request.body.validate[Category].map { newCategory =>
      categories = categories :+ newCategory
      Created(Json.toJson(newCategory))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def update(id: Long) = Action(parse.json) { request =>
    request.body.validate[Category].map { updated =>
      categories = categories.map(c => if (c.id == id) updated else c)
      Ok(Json.toJson(updated))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def delete(id: Long) = Action {
    categories = categories.filterNot(_.id == id)
    NoContent
  }

}