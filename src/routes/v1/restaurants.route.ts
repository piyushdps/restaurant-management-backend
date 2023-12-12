import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { restaurantController, restaurantValidation } from '../../modules/restaurants';

const router: Router = express.Router();
// open APIs
// admin APIs
// user APIs

router
  .route('/')
  .post(auth('manageRestaurants'), validate(restaurantValidation.createRestaurant), restaurantController.addRestaurant)
  .get(auth('getOwnRestaurants'), validate(restaurantValidation.getRestaurants), restaurantController.getOwnedRestaurants);

router
  .route('/all')
  .get(auth('getRestaurants'), validate(restaurantValidation.getRestaurants), restaurantController.getRestaurants);

router
  .route('/:restaurantId')
  .get(auth('getRestaurant'), validate(restaurantValidation.getRestaurant), restaurantController.getRestaurant)
  .patch(auth('manageRestaurants'), validate(restaurantValidation.updateRestaurant), restaurantController.updateRestaurant)
  .delete(auth('manageRestaurants'), validate(restaurantValidation.deleteUser), restaurantController.deleteRestaurant);

export default router;
/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management and retrieval
 */

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: add a restaurant
 *     description: Restaurant owners and admins can create restaurants.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - contact
 *               - pinCode
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: number
 *                 description: must be unique
 *               pinCode:
 *                 type: number
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake restraunt name
 *               contact: 8723991138
 *               pinCode: 119923
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateContact'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all restaurants
 *     description: Only usersOwning and admins can retrieve all restaurants.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Restaurant name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurants'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /restaurant/{id}:
 *   get:
 *     summary: Get a restaurant
 *     description: Owning users and admins can fetch only restaurant information. Only admins can fetch other restaurants.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Restaurants'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a restaurant
 *     description: Logged in users can only update their own restaurant info. Only admins can update other restaurants.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: number
 *                 description: must be unique
 *               pinCode:
 *                 type: number
 *                 description: pinCode of operating are
 *             example:
 *               name: fake name
 *               pinCode: 893189
 *               contact: 8789226103
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a restaurant
 *     description: Logged in users can delete only their restaurants. Only admins can delete other users.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /restaurants/all:
 *   get:
 *     summary: Get all restaurants
 *     description: Owning users and admins can fetch only restaurant information. Only admins can fetch other restaurants.
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Restaurants'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
