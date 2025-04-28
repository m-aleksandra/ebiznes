package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Product

@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {
  private var products = List(
    Product(1, "Shirt", 59.99, 1),
    Product(2, "Dress", 99.99, 1),
    Product(3, "Boots", 129.99, 2),
  )
  implicit val productFormat: OFormat[Product] = Json.format[Product]

  def getAll = Action {
    Ok(Json.toJson(products))
  }

  def getById(id: Long) = Action {
    products.find(_.id == id).map(p => Ok(Json.toJson(p))).getOrElse(NotFound)
  }

  def add = Action(parse.json) { request =>
    request.body.validate[Product].map { newProduct =>
      products = products :+ newProduct
      Created(Json.toJson(newProduct))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def update(id: Long) = Action(parse.json) { request =>
    request.body.validate[Product].map { updated =>
      products = products.map(p => if (p.id == id) updated else p)
      Ok(Json.toJson(updated))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def delete(id: Long) = Action {
    products = products.filterNot(_.id == id)
    NoContent
  }
}
