composer archive create --sourceType dir --sourceName . -a lego4-network@0.3.3.bna  
composer network install --card PeerAdmin@hlfv1 --archiveFile lego4-network@0.3.3.bna  
composer network upgrade -c PeerAdmin@hlfv1 -n lego4-network -V 0.3.3  
composer network ping -c admin@lego4-network | grep Business  
composer-rest-server -c admin@lego4-network -n never -u true -w true 
