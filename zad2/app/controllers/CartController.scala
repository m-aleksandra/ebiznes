package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.{Cart, CartItem}

@Singleton
class CartController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private var carts = List(
    Cart(1, List(CartItem(1, 2), CartItem(3, 1))),
    Cart(2, List(CartItem(2, 1)))
  )

  implicit val cartItemFormat: OFormat[CartItem] = Json.format[CartItem]
  implicit val cartFormat: OFormat[Cart] = Json.format[Cart]

  // View all items in a cart
  def getItems(cartId: Long) = Action {
    carts.find(_.id == cartId) match {
      case Some(cart) => Ok(Json.toJson(cart.items))
      case None       => NotFound(s"Cart $cartId not found")
    }
  }

  // Add item to cart (or increase quantity if already exists)
  def addItem(cartId: Long) = Action(parse.json) { request =>
    request.body.validate[CartItem].map { newItem =>
      carts.find(_.id == cartId) match {
        case Some(cart) =>
          val updatedItems = cart.items.find(_.productId == newItem.productId) match {
            case Some(existing) =>
              cart.items.map {
                case item if item.productId == newItem.productId =>
                  item.copy(quantity = item.quantity + newItem.quantity)
                case item => item
              }
            case None =>
              cart.items :+ newItem
          }

          val updatedCart = cart.copy(items = updatedItems)
          carts = carts.map(c => if (c.id == cartId) updatedCart else c)
          Ok(Json.toJson(updatedCart))

        case None => NotFound(s"Cart $cartId not found")
      }
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  // Update quantity of a cart item
  def updateItem(cartId: Long, productId: Long) = Action(parse.json) { request =>
    request.body.validate[CartItem].map { updatedItem =>
      carts.find(_.id == cartId) match {
        case Some(cart) =>
          val updatedItems = cart.items.map {
            case item if item.productId == productId =>
              item.copy(quantity = updatedItem.quantity)
            case item => item
          }

          val updatedCart = cart.copy(items = updatedItems)
          carts = carts.map(c => if (c.id == cartId) updatedCart else c)
          Ok(Json.toJson(updatedCart))

        case None => NotFound(s"Cart $cartId not found")
      }
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  // Remove item from cart
  def deleteItem(cartId: Long, productId: Long) = Action {
    carts.find(_.id == cartId) match {
      case Some(cart) =>
        val updatedItems = cart.items.filterNot(_.productId == productId)
        val updatedCart = cart.copy(items = updatedItems)
        carts = carts.map(c => if (c.id == cartId) updatedCart else c)
        NoContent
      case None => NotFound(s"Cart $cartId not found")
    }
  }
}
