package models

import models.CartItem

case class Cart(id: Long, items: List[CartItem])
