module ApplicationHelper
  
  # SUtalk Logo
  def logo
    image_tag("logo.png", :alt => "SUtalk", :class => "round", :id => "logo")
  end
  
  # SUtalk Link, including Session ID for OpenTok Room.
  def sutalkLink element_id
       text_field_tag "#{element_id}", @room[:sutalkLink], 
                      :readonly => true, :class => "sutalkLink round"
  end
  
  # Is this user entering into a new room?  If yes, return true.  
  # User is entering a new room if sid and request_id are not in the URL.
  def newRoom?
     @params[:sid].blank? && @params[:request_ids].blank? 
  end
end
