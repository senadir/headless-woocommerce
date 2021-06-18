import {
	createContext,
	useContext,
	useState,
	useCallback,
	forwardRef,
	Component,
} from 'react';
import { formatPrice, getCurrencyFromPriceResponse } from '../../utils';
import { useAddItem } from '../../hooks';
import { UnitInput } from '@wp-g2/components';

const ProductContext = createContext();

export const useProduct = ( replacedData ) => {
	const product = useContext( ProductContext );
	for ( const [ key, value ] of Object.entries( replacedData ) ) {
		if ( product.hasOwnProperty( key ) && !! value ) {
			if ( typeof value === 'function' ) {
				product[ key ] = value( product[ key ], product );
			} else {
				product[ key ] = value;
			}
		}
	}
	return product;
};

class Product extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			quantity: 1,
		};
	}

	setQuantity = ( quantity ) => {
		this.setState( { quantity } );
	};
	render() {
		const product = {
			quantity: this.state.quantity,
			setQuantity: this.setQuantity,
			...this.props.product,
		};
		return (
			<ProductContext.Provider value={ product }>
				<div className={ this.props.className }>
					{ this.props.children }
				</div>
			</ProductContext.Provider>
		);
	}
}
const Title = forwardRef(
	( { override = {}, as: Component = 'h2', className, ...rest }, ref ) => {
		const { name } = useProduct( override );

		return (
			<Component className={ className } { ...rest } ref={ ref }>
				{ name }
			</Component>
		);
	}
);

const Description = ( {
	override = {},
	as: Component = 'div',
	className,
	...rest
} ) => {
	const { short_description } = useProduct( override );

	return (
		<Component
			className={ className }
			{ ...rest }
			dangerouslySetInnerHTML={ { __html: short_description } }
		/>
	);
};

const Image = forwardRef(
	(
		{ override = {}, as: Component = 'figure', className, ...rest },
		ref
	) => {
		const { images } = useProduct( override );
		const [ currentImage, setCurrentImage ] = useState( images[ 0 ].src );
		const switchImage = useCallback(
			( revert = false ) => {
				if ( images.length > 1 ) {
					setCurrentImage(
						revert ? images[ 0 ].src : images[ 1 ].src
					);
				}
			},
			[ setCurrentImage, images ]
		);
		return (
			<Component
				className={ className }
				onMouseEnter={ () => switchImage() }
				onMouseLeave={ () => switchImage( true ) }
				{ ...rest }
				ref={ ref }
			>
				<img src={ currentImage } className="object-cover" />
			</Component>
		);
	}
);

const Price = ( { override = {}, className, ...rest } ) => {
	const { prices } = useProduct( override );
	const currency = getCurrencyFromPriceResponse( prices );
	return (
		<p className={ className } { ...rest }>
			{ formatPrice( prices.price, currency ) }
		</p>
	);
};
const AddToCart = ( {
	override = {},
	className,
	onClick = ( cb ) => cb(),
	...rest
} ) => {
	const { add_to_cart, id } = useProduct( override );
	const { addItem, isLoading } = useAddItem();
	const handleAddToCart = useCallback( () => {
		addItem( id );
	}, [ id, addItem ] );
	return (
		<button
			className={ `${ className } ${
				isLoading && 'bg-gray-200 hover:bg-gray-200 pointer-events-none'
			}` }
			onClick={ () => onClick( handleAddToCart ) }
			disabled={ isLoading }
			{ ...rest }
		>
			{ add_to_cart.text }
		</button>
	);
};

const Quantity = ( { override = {}, className, ...rest } ) => {
	const { quantity, setQuantity } = useProduct( override );
	return (
		<UnitInput
			arrows="stepper"
			min="0"
			value={ parseInt( quantity ) }
			onChange={ setQuantity }
			className={ className }
			size="large"
			{ ...rest }
		/>
	);
};

Product.Title = Title;
Product.Description = Description;
Product.Image = Image;
Product.Price = Price;
Product.AddToCart = AddToCart;
Product.Description = Description;
Product.Quantity = Quantity;

export { Product };
