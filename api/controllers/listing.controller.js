import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, 'You can only delete your own listings.'));
        }
        await listing.destroy();
        res.status(200).json('Listing has been deleted');
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) return next(errorHandler(404, "Listing not found!"));
        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, 'You can only update your own listings.'));
        }
        await listing.update(req.body);
        res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findByPk(req.params.id);
        if (!listing) return next(errorHandler(404, "Listing not found!"));
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        // Build where clause for Sequelize
        const where = {};
        if (req.query.offer !== undefined && req.query.offer !== 'false') {
            where.offer = req.query.offer === 'true';
        }
        if (req.query.parking !== undefined && req.query.parking !== 'false') {
            where.parking = req.query.parking === 'true';
        }
        if (req.query.furnished !== undefined && req.query.furnished !== 'false') {
            where.furnished = req.query.furnished === 'true';
        }
        if (req.query.type !== undefined && req.query.type !== 'all') {
            where.type = req.query.type;
        }
        if (req.query.searchTerm) {
            where.name = { [Symbol.for('like')]: `%${req.query.searchTerm}%` };
        }

        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

        const listings = await Listing.findAll({
            where,
            order: [[sort, order]],
            limit,
            offset: startIndex,
        });
        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
}