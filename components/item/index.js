import { useState, useCallback, forwardRef } from 'react';
import { Product, useProduct } from '../product';
import { UnitInput } from '@wp-g2/components';
import { useUpdateItem, useRemoveItem } from '../../hooks';
import debounce from 'lodash/debounce';

class Item extends Product {
	render() {
		const item = {
			...this.props.item,
		};
		return (
			<Product className={ this.props.className } product={ item }>
				{ this.props.children }
			</Product>
		);
	}
}

const Quantity = ( { override = {}, className, ...rest } ) => {
	const { quantity: intiailQuantity, key } = useProduct( override );
	const [ quantity, setQuantity ] = useState( intiailQuantity );
	const { updateItem, isLoading: isLoadingUpdate } = useUpdateItem();
	const { removeItem, isLoading: isLoadingRemove } = useRemoveItem();
	const debouncedUpdateItem = debounce( updateItem, 400, {
		leading: false,
		trailing: true,
	} );
	const updateQuantity = useCallback(
		( value ) => {
			setQuantity( parseInt( value, 10 ) );
			if ( parseInt( value, 10 ) === 0 ) {
				removeItem( key );
				debouncedUpdateItem.cancel();
			} else {
				debouncedUpdateItem( { key, quantity: parseInt( value, 10 ) } );
			}
		},
		[ setQuantity, removeItem, key, debouncedUpdateItem ]
	);
	return (
		<UnitInput
			arrows="stepper"
			min={ 0 }
			unit={ null }
			disabled={ isLoadingUpdate || isLoadingRemove }
			value={ parseInt( quantity ) }
			onChange={ updateQuantity }
			className={ className }
			size="large"
			{ ...rest }
		/>
	);
};

const Remove = ( { override = {}, className, children, ...rest } ) => {
	const { key } = useProduct( override );
	const { removeItem, isLoading } = useRemoveItem();
	return (
		<button
			type="button"
			onClick={ () => removeItem( key ) }
			disabled={ isLoading }
			className={ className }
			{ ...rest }
		>
			{ children ? children : 'Remove' }
		</button>
	);
};
Item.Quantity = Quantity;
Item.Remove = Remove;

export { Item };
